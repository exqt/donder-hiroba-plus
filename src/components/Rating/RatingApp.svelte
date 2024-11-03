<script lang="ts">
    import hiroba, { parse } from 'node-hiroba'
    import Profile from './RatingProfile.svelte'
    import type { CardData, ScoreData } from 'node-hiroba/types'
    import lzutf8 from 'lzutf8'
    import type { ClearData } from './clearData'
    import { waitFor } from '../../lib/utils'

    const wikiOrigin = 'https://taiko.wiki'

    let scene: 'ready' | 'upload' = 'ready'

    // message
    let message: string = ''
    let uploadMessage: string = ''
    let counts: number = 0
    let complete: number = 0

    // ready
    let sendType: 'clear' | 'score' = 'clear'

    // 새로운 유틸리티 함수들
    async function checkWikiLogin (): Promise<boolean> {
      const wikiUser = await (await fetch(wikiOrigin + '/api/user', { credentials: 'include' })).json()
      return wikiUser.logined === true
    }

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
          console.log('fetching error try in 3 seconds')
          await waitFor(3000)
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
          console.log('fetching error try in 3 seconds')
          await waitFor(3000)
        }
      }

      console.log(response)
      if (response.body.oni === undefined && response.body.ura === undefined) return null

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const parsed = parse.parseScoreData(response as any)
      return parsed ?? null
    }

    async function uploadToWiki (donderData: CardData, clearData: ClearData[], scoreData: ScoreData[]): Promise<void> {
      const data = JSON.stringify({
        donderData,
        clearData,
        scoreData
      })

      console.log(data)

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
    }

    // 리팩토링된 send 함수
    async function send (cardData: CardData, sendType: 'clear' | 'score'): Promise<void> {
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
        let clearData = await hiroba.getClearData(null)
        clearData = clearData.filter((song) => song.songNo.length < 3) // TODO

        if (sendType === 'clear') {
          uploadMessage = 'Uploading clear data...'
          await uploadToWiki(cardData, clearData, [])
        } else {
          uploadMessage = 'Updating score...'
          // await hiroba.updateScore(null)

          const scoresToFetch: Array<Promise<ScoreData | null>> = []
          for (const song of clearData) {
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

          console.log(scoreData, clearData)

          await uploadToWiki(cardData, clearData, scoreData.filter((score) => score !== null))
        }

        message = 'Upload completed'
        scene = 'ready'
      } catch (err) {
        console.warn(err)
        message = 'Upload Error'
        scene = 'ready'
      }
    }

    // upload
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
                Upload only clear data.
            </label>
            <label>
                <input type="radio" bind:group={sendType} value="score" />
                Upload both clear data and score data.
            </label>
            <button
                on:click={async () => {
                  await send(cardData, sendType)
                }}
            >
                Upload
            </button>
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
    }

    .error_display {
        color: red;
        font-weight: bold;
    }
</style>
