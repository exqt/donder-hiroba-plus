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

    const wikiOrigin = 'https://taiko.wiki'

    let scene: 'ready' | 'upload' = 'ready'

    // message
    let message: string = ''
    let uploadMessage: string = ''
    let counts: number = 0
    let complete: number = 0

    let nRecentPageToFetch: number = 20
    const storage = new RecentScoreStorage()
    let storageLoaded = false
    let lastUpdated: string | null = null
    let scoreDataSorted: Array<{ songName: string, difficulty: string, score: DifficultyScoreData, songNo: string }> = []
    let totalPlayCount: string = '0 / 0 / 0 / 0'
    let openPlayCount: boolean = false
    let disabledRecent: boolean = true

    onMount(async () => {
      await storage.loadFromChromeStorage()
      storageLoaded = true
      lastUpdated = storage.getLastUpdated()
      updateScoreDataSorted()
      disabledRecent = storage.getCount() === 0
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

    // ready
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

    async function uploadToWiki (donderData: CardData, clearData: ClearData[], scoreDataMap: Record<string, ScoreData>): Promise<void> {
      await storage.mergeMap(scoreDataMap)

      const data = JSON.stringify({
        donderData,
        clearData,
        scoreData: storage.getMap()
      })

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
          await uploadToWiki(cardData, clearData, {})
        } else if (sendType === 'recent') {
          uploadMessage = 'Fetching recent score data...'

          counts = nRecentPageToFetch
          complete = 0
          uploadMessage = `Fetch score data... (0/${counts})`

          const recentScoreData: RecentScoreData[] = []
          await Promise.all(
            Array.from({ length: nRecentPageToFetch }, (_, i) => i + 1).map(async (page) => {
              recentScoreData.push(...(await getRecentScoreData(page)))
              complete++
              uploadMessage = `Fetch score data... (${complete}/${counts})`
            })
          )

          const scoreDataMap: Record<string, ScoreData> = {}
          for (const recentScore of recentScoreData) {
            const songNos = songNameToSongNos.get(recentScore.songName)
            if (songNos === undefined || songNos.length > 1) {
              console.warn(`multiple or undefined songNos found for ${recentScore.songName}`)
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

          for (const songNos of songNameToSongNos.values()) {
            if (songNos !== undefined && songNos.length > 1) {
              for (const songNo of songNos) {
                const score = await fetchScoreForSong(
                  songNo, clearData.find(song => song.songNo === songNo)
                )
                if (score !== null) {
                  scoreDataMap[songNo] = score
                }
              }
            }
          }

          await uploadToWiki(cardData, clearData, scoreDataMap)

          message = 'Upload completed'
          scene = 'ready'
        } else if (sendType === 'all') {
          uploadMessage = 'Fetching recent score data...'

          complete = 0
          uploadMessage = 'Fetch score data... (0/?)'

          const recentScoreData: RecentScoreData[] = []
          const firstPage = await getRecentScoreData(1)
          recentScoreData.push(...firstPage)
          complete++
          uploadMessage = `Fetch score data... (${complete}/?)`

          // parse until fetched page is same as first page
          while (true) {
            const nextPage = await getRecentScoreData(complete + 1)
            if (nextPage[0].songName === firstPage[0].songName &&
              nextPage[0].difficulty === firstPage[0].difficulty
            ) break
            recentScoreData.push(...nextPage)
            complete++
            uploadMessage = `Fetch score data... (${complete}/?)`
          }

          const scoreDataMap: Record<string, ScoreData> = {}
          for (const recentScore of recentScoreData) {
            const songNos = songNameToSongNos.get(recentScore.songName)
            if (songNos === undefined || songNos.length > 1) {
              console.warn(`multiple or undefined songNos found for ${recentScore.songName}`)
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

          for (const songNos of songNameToSongNos.values()) {
            if (songNos !== undefined && songNos.length > 1) {
              for (const songNo of songNos) {
                const score = await fetchScoreForSong(songNo, clearData.find(song => song.songNo === songNo))
                if (score !== null) {
                  scoreDataMap[songNo] = score
                }
              }
            }
          }

          await uploadToWiki(cardData, clearData, scoreDataMap)

          message = 'Upload completed'
          scene = 'ready'
        } else if (sendType === 'score') {
          uploadMessage = 'Updating score...'

          const scoresToFetch: Array<Promise<ScoreData | null>> = []
          for (const song of clearData) {
            // if (song.songNo.length >= 3 || song.songNo >= '30') continue // for debug
            if (song.difficulty.oni !== undefined || song.difficulty.ura !== undefined) {
              scoresToFetch.push(fetchScoreForSong(song.songNo, song))
            }
          }

          counts = scoresToFetch.length
          complete = 0
          uploadMessage = `Fetch score data... (0/${counts})`

          const scoreData = await Promise.all(scoresToFetch.map(async (promise) => {
            const result = await promise
            complete++
            uploadMessage = `Fetch score data... (${complete}/${counts})`
            return result
          }))

          const scoreDataMap: Record<string, ScoreData> = {}
          for (const score of scoreData) {
            if (score !== null) {
              scoreDataMap[score.songNo] = score
            }
          }

          await uploadToWiki(cardData, clearData, scoreDataMap)
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
            <label class:disabled={disabledRecent} class="recent-score-label" style="text-align: center; background-color: #f0f0f0;">
              <input type="radio" bind:group={sendType} value="recent" />
              clear data + score data <br> (only recent
                <select bind:value={nRecentPageToFetch}>
                  <option value={5}>25 (1 hour)</option>
                  <option value={10}>50 (2 hours)</option>
                  <option value={20}>100 (4 hours)</option>
                  <option value={30}>150 (6 hours)</option>
                  <option value={40}>200 (8 hours)</option>
                  <option value={60}>300 (12 hours)</option>
                  <option value={80}>400 (16 hours)</option>
                  <option value={100}>500 (20 hours)</option>
                </select>
                plays)
                <br>
                <span style="font-size: 0.8rem;">much faster, use this if you recently uploaded score data</span>
                <br>
                <span style="font-size: 0.8rem;">최근에 레이팅을 업로드한 경우 이걸 선택하세요</span>
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
                    {#each scoreDataSorted as score}
                      <tr>
                        <td style="max-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                          ({score.songNo}) {score.songName}
                        </td>
                        <td>{score.difficulty}</td>
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

    .recent-score-label.disabled {
      pointer-events: none;
      opacity: 0.5;
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
