<script lang="ts">
    import hiroba, { parse } from 'node-hiroba'
    import Profile from './RatingProfile.svelte'
    import type { CardData, ScoreData } from 'node-hiroba/types'
    import lzutf8 from 'lzutf8'

    const wikiOrigin = 'https://taiko.wiki'

    let scene: 'ready' | 'upload' = 'ready'

    // message
    let message: string = ''
    let uploadMessage: string = ''
    let counts: number = 0
    let complete: number = 0

    // ready
    let sendType: 'clear' | 'score' = 'clear'
    async function send (cardData: CardData, sendType: 'clear' | 'score'): Promise<void> {
      if (
        !confirm(
                `Send your donderhiroba datas to ${wikiOrigin}. It will be deleted together when you delete your account. Do you agree?`
        )
      ) {
        alert('Canceled.')
        message = ''
        uploadMessage = ''
        scene = 'ready'
        return
      }

      const wikiUser = await (
        await fetch(wikiOrigin + '/api/user', {
          credentials: 'include'
        })
      ).json()
      if (wikiUser.logined === false) {
        message = 'Wiki Not Logined'
        return
      }

      try {
        scene = 'upload'
        uploadMessage = ''
        // 클리어 데이터만
        if (sendType === 'clear') {
          uploadMessage = 'Fetching clear data...'
          const clearData = await hiroba.getClearData(null)
          uploadMessage = 'Uploading clear data...'
          const data = JSON.stringify({
            donderData: cardData,
            clearData
          })
          const body = lzutf8.compress(data, {
            outputEncoding: 'ByteArray'
          }) as Uint8Array
          await fetch(wikiOrigin + '/api/user/donder', {
            credentials: 'include',
            method: 'POST',
            body,
            headers: {
              'Content-Type': 'application/json'
            }
          })
        } else { // 점수 데이터
          uploadMessage = 'Updating score...'
          await hiroba.updateScore(null)
          uploadMessage = 'Fetching clear data...'
          const clearData = await hiroba.getClearData(null)
          const songNoDatas: Array<{ songNo: string, hasUra: boolean }> =
                    []
          clearData.forEach((e) => {
            const hasUra = !(e.difficulty.ura === undefined)
            songNoDatas.push({
              songNo: e.songNo,
              hasUra
            })
          })

          counts = clearData.length
          complete = 0
          uploadMessage = `Fetch score data... (0/${counts})`

          const grouped: Array<
          Array<{ songNo: string, hasUra: boolean }>
          > = [[], [], [], [], [], [], [], [], [], []]
          songNoDatas.forEach((song, index) => {
            grouped[Number(index.toString().at(-1))].push(song)
          })
          const scoreData: Record<string, ScoreData> = {}
          const errors: Array<{ songNo: string, hasUra: boolean }> = []
          await Promise.all(
            grouped.map(async (group) => {
              for (const song of group) {
                /** eslint-disable @typescript-eslint/no-unsafe-argument */
                const response: any = {
                  songNo: song.songNo,
                  body: {}
                }

                try {
                  const fetched = await fetch(
                                    `https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=4`
                  )
                  const body = await fetched.text()
                  response.body.oni = body
                  if (song.hasUra) {
                    const fetched = await fetch(
                                        `https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=5`
                    )
                    const body = await fetched.text()
                    response.body.ura = body
                  }
                } catch {
                  errors.push(song)
                  continue
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const parsed = parse.parseScoreData(response)

                if (parsed !== null) {
                  scoreData[song.songNo] = parsed
                  complete++
                  uploadMessage = `Fetch score data... (${complete}/${counts})`
                }
              }
            })
          )

          for (const song of errors) {
            const response: any = {
              songNo: song.songNo,
              body: {}
            }

            try {
              const fetched = await fetch(
                            `https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=4`
              )
              const body = await fetched.text()
              response.body.oni = body
              if (song.hasUra) {
                const fetched = await fetch(
                                `https://donderhiroba.jp/score_detail.php?song_no=${song.songNo}&level=5`
                )
                const body = await fetched.text()
                response.body.ura = body
              }
            } catch {
              errors.push(song)
              continue
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const parsed = parse.parseScoreData(response)

            if (parsed !== null) {
              scoreData[song.songNo] = parsed
              complete++
              uploadMessage = `Fetch score data... (${complete}/${counts})`
            }
          }

          const data = JSON.stringify({
            donderData: cardData,
            clearData,
            scoreData
          })

          const body = lzutf8.compress(data, {
            outputEncoding: 'ByteArray'
          }) as Uint8Array

          await fetch(wikiOrigin + '/api/user/donder', {
            credentials: 'include',
            method: 'POST',
            body,
            headers: {
              'Content-Type': 'application/json'
            }
          })
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
