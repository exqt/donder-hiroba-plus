<script lang="ts">
  import { ScoreStorage } from '../../../lib/scores'
  import TrainingCourseStorage from '../../../lib/trainingCourse'
  import { SongDB } from '../../../lib/songDB'
  import Course from '../view/Course.svelte'
  import { push, location } from 'svelte-spa-router'
  import { getContext, setContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import type { DifficultyType, SongScoreDetailBest } from '../../../types'
  import { DIFFICULTIES } from '../../../constants'
  import Button from '../../Common/Button.svelte'
  import I18N from '../../../lib/i18n'

  let rerendering = false
  function rerender (): void {
    rerendering = !rerendering
  }

  let jsonInput: HTMLInputElement
  async function importCourse (json: string): Promise<void> {
    const storage = await TrainingCourseStorage.getInstance()
    storage.add(TrainingCourseStorage.parse(json))
    await storage.save()
    console.log('불러오기 완료')
    jsonInput.value = ''
    rerender()
  }

  // eslint-disable-next-line
  const title = getContext("title") as Writable<string>;

  async function reload (): Promise<void> {
    const songs: Record<string, DifficultyType[]> = {}
    const storage = await TrainingCourseStorage.getInstance()
    storage.getAll().forEach((course) => {
      course.songs.forEach((song) => {
        if (!(song.songNo.toString() in songs)) {
          songs[song.songNo] = []
        }
        songs[song.songNo].push(song.difficulty)
      })
    })

    const scoreStorage = await ScoreStorage.getInstance()

    await Promise.all(
      Object.keys(songs).map(async (songNo) => {
        return await Promise.all(
          songs[songNo].map(async (difficulty) => {
            try {
              const response = await (
                await fetch(
                  `/score_detail.php?song_no=${songNo}&level=${DIFFICULTIES.indexOf(difficulty) + 1}`
                )
              ).text()
              const dom = new DOMParser().parseFromString(
                response,
                'text/html'
              )

              const scoreDetailTable = dom.querySelector('.scoreDetailTable')
              if (scoreDetailTable === null) throw new Error()
              if (dom.querySelector('.contentBox.errorArea') !== null) {
                throw new Error()
              }

              const playdata: SongScoreDetailBest = {
                /* eslint-disable */
                score: parseInt(
                  (dom.querySelector("div.high_score") as HTMLElement).innerText
                    .trim()
                    .replace("点", "") as string,
                ),
                good: parseInt(
                  (dom.querySelector("div.good_cnt") as HTMLElement).innerText
                    .trim()
                    .replace("回", "") as string,
                ),
                ok: parseInt(
                  (dom.querySelector("div.ok_cnt") as HTMLElement).innerText
                    .trim()
                    .replace("回", "") as string,
                ),
                ng: parseInt(
                  (dom.querySelector("div.ng_cnt") as HTMLElement).innerText
                    .trim()
                    .replace("回", "") as string,
                ),
                pound: parseInt(
                  (dom.querySelector("div.pound_cnt") as HTMLElement).innerText
                    .trim()
                    .replace("回", "") as string,
                ),
                combo: parseInt(
                  (dom.querySelector("div.combo_cnt") as HTMLElement).innerText
                    .trim()
                    .replace("回", "") as string,
                ),
                hit: 0,
                /* eslint-enable */
              }

              playdata.hit = playdata.good + playdata.ok + playdata.pound

              const songScoreDetail =
                scoreStorage.getScoreByNo(songNo)?.details[difficulty]
              if (songScoreDetail !== undefined) {
                songScoreDetail.best = playdata
              }
            } catch (err) {
              console.log(err)
            }
          })
        )
      })
    )

    await scoreStorage.save()
    alert('새로고침 완료')
    rerender()
  }

  /* eslint-disable*/
  let i18n = I18N.getInstance()
  setContext<Promise<I18N>>('i18n', i18n)
</script>

{#await i18n then i18n}
<div class="load-container">
  <Button
    on:click={async () => {
      await push('/training/add')
    }}>{i18n.t('追加')}</Button
  >
  <Button on:click={reload}>{i18n.t('リロード')}</Button>
</div>
<div class="load-container">
  <input type="text" bind:this={jsonInput} placeholder="json" />
  <Button
    on:click={async () => {
      await importCourse(jsonInput.value)
    }}>{i18n.t('インポート')}</Button
  >
</div>
{#key $location}
  {#await Promise.all([TrainingCourseStorage.getInstance(), ScoreStorage.getInstance(), SongDB.getInstance()]) then [courseStorage, scoreStorage, songDB]}
    {#key rerendering}
      {#each courseStorage.getAll() as course}
        <Course {course} {scoreStorage} {songDB} {courseStorage} {rerender} />
      {/each}
    {/key}
  {/await}
{/key}
{/await}

<style>
  .load-container {
    width: 300px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 4px;
  }

  .load-container input {
    width: 218px;
  }
</style>
