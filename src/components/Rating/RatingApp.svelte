<script lang="ts">
    import hiroba, { parse } from 'node-hiroba'
    import Profile from './RatingProfile.svelte'
    import type { CardData, ScoreData } from 'node-hiroba/types'
    import lzutf8 from 'lzutf8'
    import type { ClearData, DifficultyScoreData } from './ratingTypes'
    import { waitFor } from '../../lib/utils'
    import { onMount } from 'svelte'
    import { getRecentScoreData, type RecentScoreData } from './recentScore'
    import RecentScoreStorage from './recentScoreStorage'
    import { DIFFICULTY_COLORS } from '../../constants'
    import { clearTop50RatingCache } from '../../lib/rating'

    const wikiOrigin = 'https://taiko.wiki'

    let scene: 'ready' | 'upload' = 'ready'

    // message
    let message: string = ''
    let uploadMessage: string = ''
    let complete: number = 0

    const storage = new RecentScoreStorage()
    let storageLoaded = false
    let lastUpdated: string | null = null
    let scoreDataSorted: Array<{ songName: string, difficulty: string, score: DifficultyScoreData, songNo: string }> = []
    let totalPlayCount: string = '0 / 0 / 0 / 0'
    let openPlayCount: boolean = false

    onMount(async () => {
      await storage.loadFromChromeStorage()
      storageLoaded = true
      lastUpdated = storage.getLastUpdated()
      updateScoreDataSorted()
    })

    const updateScoreDataSorted = (): void => {
      scoreDataSorted = []
      let totalPlay = 0
      let totalClear = 0
      let totalFullcombo = 0
      let totalDonderfullcombo = 0
      for (const [songNo, scoreData] of Object.entries(storage.getMap())) {
        for (const [difficulty, score] of Object.entries(scoreData.difficulty)) {
          if (difficulty !== 'oni' && difficulty !== 'ura') continue
          scoreDataSorted.push({
            songName: scoreData.title,
            difficulty,
            score,
            songNo
          })
          totalPlay += score.count.play
          totalClear += score.count.clear
          totalFullcombo += score.count.fullcombo
          totalDonderfullcombo += score.count.donderfullcombo
        }
      }
      scoreDataSorted.sort((a, b) => b.score.count.play - a.score.count.play)
      totalPlayCount = `${totalPlay} / ${totalClear} / ${totalFullcombo} / ${totalDonderfullcombo}`
    }

    let sendType: 'clear' | 'score' | 'all' | 'recent' = 'clear'

    // 새로운 유틸리티 함수들
    async function checkWikiLogin (): Promise<boolean> {
      const wikiUser = await (await fetch(wikiOrigin + '/api/user', { credentials: 'include' })).json()
      return wikiUser.logined === true
    }

    let waitTime = 3000
    async function fetchScoreForSong (songNo: string, clearData: ClearData): Promise<ScoreData | null> {
      const response: { songNo: string, body: { oni?: string, ura?: string } } =
        { songNo, body: {} }

      while (true) {
        try {
          if (clearData.difficulty.oni === undefined) break
          response.body.oni = await (await fetch(
            `https://donderhiroba.jp/score_detail.php?song_no=${songNo}&level=${4}`
          )).text()
          break
        } catch {
          await waitFor(waitTime)
          waitTime *= 2
        }
      }

      while (true) {
        try {
          if (clearData.difficulty.ura === undefined) break
          response.body.ura = await (await fetch(
            `https://donderhiroba.jp/score_detail.php?song_no=${songNo}&level=${5}`
          )).text()
          break
        } catch {
          await waitFor(waitTime)
          waitTime *= 2
        }
      }

      if (response.body.oni === undefined && response.body.ura === undefined) return null

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const parsed = parse.parseScoreData(response as any)
      return parsed ?? null
    }

    async function uploadToWiki (donderData: CardData, clearData: ClearData[], scoreDataMap?: Record<string, ScoreData>): Promise<void> {
      let data
      if (scoreDataMap !== undefined) {
        await storage.mergeMap(scoreDataMap)
        data = JSON.stringify({
          donderData,
          clearData,
          scoreData: storage.getMap()
        })
      } else {
        data = JSON.stringify({
          donderData,
          clearData
        })
      }

      const compressedBody = lzutf8.compress(data, {
        outputEncoding: 'ByteArray'
      }) as Uint8Array

      await fetch(wikiOrigin + '/api/user/donder', {
        credentials: 'include',
        method: 'POST',
        body: compressedBody,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      updateScoreDataSorted()
    }

    // 리팩토링된 send 함수
    async function send (cardData: CardData, sendType: 'clear' | 'score' | 'all' | 'recent'): Promise<void> {
      if (!confirm(`Send your donderhiroba datas to ${wikiOrigin}. It will be deleted together when you delete your account. Do you agree?`)) {
        alert('Canceled.')
        message = ''
        uploadMessage = ''
        scene = 'ready'
        return
      }

      if (!await checkWikiLogin()) {
        message = 'Wiki Not Logined'
        return
      }

      try {
        scene = 'upload'
        uploadMessage = ''

        uploadMessage = 'Fetching clear data...'

        await hiroba.updateScore(null)
        const clearData = await hiroba.getClearData(null)
        const prevScoreDataMap = { ...storage.getMap() }

        const songNameToSongNos = new Map<string, string[]>()
        for (const song of clearData) {
          if (songNameToSongNos.has(song.title)) {
            songNameToSongNos.get(song.title)?.push(song.songNo)
            console.log(song.title, songNameToSongNos.get(song.title))
          } else {
            songNameToSongNos.set(song.title, [song.songNo])
          }
        }

        if (sendType === 'clear') {
          uploadMessage = 'Uploading clear data...'
          await uploadToWiki(cardData, clearData)
        } else if (sendType === 'all') {
          uploadMessage = 'Fetching recent score data...'

          complete = 0
          uploadMessage = 'Fetch score data... (0/?)'

          const recentScoreData: RecentScoreData[] = []
          const firstPage = await getRecentScoreData(1)
          recentScoreData.push(...firstPage)
          complete++
          uploadMessage = `Fetch score data... (${complete}/?)`

          let shouldStop = false
          while (!shouldStop) {
            const nextPage = await getRecentScoreData(complete + 1)

            // termniate condtion 1: no more data
            let allSame = true
            for (let i = 0; i < nextPage.length; i++) {
              if (nextPage[i].songName !== firstPage[i].songName ||
                nextPage[i].difficulty !== firstPage[i].difficulty
              ) {
                allSame = false
                break
              }
            }
            if (allSame) {
              shouldStop = true
            }

            // termniate condtion 2: no more plays
            for (const item of nextPage) {
              const songNos = songNameToSongNos.get(item.songName)
              if (songNos === undefined || songNos.length > 1) {
                continue
              }
              const scoreData = prevScoreDataMap[songNos[0]]

              if (item.scoreData.count.play ===
              scoreData?.difficulty?.[item.difficulty]?.count.play) {
                shouldStop = true
              }
            }

            recentScoreData.push(...nextPage)
            complete++
            uploadMessage = `Fetch score data... (${complete}/?)`
          }

          const nextPage = await getRecentScoreData(complete + 1)
          recentScoreData.push(...nextPage)
          complete++
          uploadMessage = `Fetch score data... (${complete}/?)`

          const seenDuplicatedSongNames = new Set<string>()
          const scoreDataMap: Record<string, ScoreData> = {}
          for (const recentScore of recentScoreData) {
            const songNos = songNameToSongNos.get(recentScore.songName)
            if (songNos === undefined) {
              continue
            }
            if (songNos.length > 1) {
              seenDuplicatedSongNames.add(recentScore.songName)
              continue
            }
            const songNo = songNos[0]

            const score = recentScore.scoreData
            if (scoreDataMap[songNo] === undefined) {
              scoreDataMap[songNo] = {
                title: recentScore.songName,
                songNo,
                difficulty: {}
              }
            }
            scoreDataMap[songNo].difficulty[recentScore.difficulty] = score
          }

          for (const [songName, songNos] of songNameToSongNos.entries()) {
            if (songNos !== undefined && songNos.length > 1) {
              if (!seenDuplicatedSongNames.has(songName)) {
                break
              }
              for (const songNo of songNos) {
                const songClearData = clearData.find(song => song.songNo === songNo)
                if (songClearData !== undefined) {
                  const score = await fetchScoreForSong(songNo, songClearData)
                  if (score !== null) {
                    scoreDataMap[songNo] = score
                  }
                }
              }
            }
          }

          await clearTop50RatingCache()
          await uploadToWiki(cardData, clearData, scoreDataMap)

          message = 'Upload completed'
          scene = 'ready'
        }

        message = 'Upload completed'
        scene = 'ready'
      } catch (err) {
        console.warn(err)
        message = 'Upload Error'
        scene = 'ready'
      }
    }
</script>

<div class="container">
    {#await hiroba.getCurrentLogin(null)}
        Loading...
    {:then cardData}
        {#if scene === 'ready'}
            {#if message}
                <div class="error_display">{message}</div>
            {/if}
            <Profile {cardData} />
            <label>
              <input type="radio" bind:group={sendType} value="clear" />
              only clear data (서열표 색칠만)
            </label>
            <!--
            <label>
              <input type="radio" bind:group={sendType} value="score" />
              clear data + score data (old method, slow)
            </label>
            -->
            <label>
              <input type="radio" bind:group={sendType} value="all" />
              clear data + score data (레이팅)
            </label>
            <button style="margin-top: 20px; font-size: 1.5rem;"
                on:click={async () => {
                  await send(cardData, sendType)
                }}
            >
                Upload
            </button>
            {#if storageLoaded}

              <div style="margin-top: 50px;">
                <span>Last Score Updated: <br> {lastUpdated}</span>
              </div>
              <button on:click={async () => {
                await storage.clear()
                // reload
                location.reload()
              }}>
                Clear Cache
              </button>

              <button on:click={() => { openPlayCount = !openPlayCount }}>Play Count (click to expand)</button>
              {#if openPlayCount}
                <span>Count: {scoreDataSorted.length}</span>
                <span>Total Play Count: {totalPlayCount}</span>
                <table class="play-count-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th style="width: 60px">Diff</th>
                      <th style="width: 100px">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each scoreDataSorted as score, i}
                      <tr>
                        <td style="max-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                          <a href={`https://donderhiroba.jp/score_detail.php?song_no=${score.songNo}&level=${score.difficulty === 'oni' ? 4 : 5}`} target="_blank">
                            ({score.songNo}) {score.songName}
                          </a>
                        </td>
                        <td
                          style={`color: ${DIFFICULTY_COLORS[score.difficulty === 'oni' ? 3 : 4]}; font-weight: bold;`}
                        >{score.difficulty}</td>
                        <td>{score.score.count.play} / {score.score.count.clear} / {score.score.count.fullcombo} / {score.score.count.donderfullcombo}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              {/if}
            {/if}
        {:else if scene === 'upload'}
            {uploadMessage}
        {/if}
    {:catch}
        <div class="error_display">Not Logined</div>
    {/await}
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1rem;
        text-align: center;
        line-height: 1.5;
    }

    .error_display {
        color: red;
        font-weight: bold;
    }

    .play-count-table {
      width: 100%;
      max-width: 600px;
      border: 1px solid black;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .play-count-table th,
    .play-count-table td {
      border: 1px solid black;
      padding: 5px;
      text-align: center;
    }
</style>
