<script lang="ts">
  import type { ScoreStorage } from '../../../lib/scores'
  import type { SongDB } from '../../../lib/songDB'
  import type TrainingCourseStorage from '../../../lib/trainingCourse'
  import type { TrainingCourse } from '../../../types'
  import Song from './Song.svelte'
  import { push } from 'svelte-spa-router'
  import { getContext } from 'svelte'
  import type I18N from '../../../lib/i18n'

  export let course: TrainingCourse
  export let courseStorage: TrainingCourseStorage
  export let scoreStorage: ScoreStorage
  export let songDB: SongDB
  export let rerender: () => void

  async function remove (): Promise<void> {
    courseStorage.remove(course.hash)
    await courseStorage.save()
    rerender()
  }

  async function copy (): Promise<void> {
    try {
      await navigator.clipboard.writeText(JSON.stringify(course))
      alert('복사되었습니다.')
    } catch (err) {
      console.log(err)
      alert('복사에 실패했습니다.')
    }
  }

  let achieved = 0
  function addAchieve (): void {
    achieved++
  }
  function progress (): string {
    return `background: linear-gradient(90deg, rgba(42,128,247,1) 0%, rgba(42,128,247,1) calc( 100% * ${achieved} / ${course.songs.length} ), rgba(0,0,0,0) calc( 100% * ${achieved} / ${course.songs.length} ), rgba(0,0,0,0) 100%);`
  }

  // eslint-disable-next-line
  const i18n = getContext('i18n') as Promise<I18N>
</script>

{#await i18n then i18n}
<div class="btn-container">
  <button class="btn" on:click={copy}>{i18n.t('エクスポート')}</button>
  <button
    class="btn"
    on:click={async () => {
      await push(`/training/edit/${course.hash}`)
    }}>{i18n.t('修整')}</button
  >
  <button class="btn" on:click={remove}>{i18n.t('削除')}</button>
</div>
<div class="container">
  <h1 class="name">
    {course.name}
  </h1>
  {#key achieved}
    <div class="progress" style={`${progress()}`}>
      {achieved}/{course.songs.length}
    </div>
  {/key}
  {#each course.songs as song}
    <Song {song} {songDB} {scoreStorage} {addAchieve} />
  {/each}
</div>
{/await}

<style>
  .btn-container {
    margin-top: 8px;

    width: 300px;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .btn {
    min-width: 50px;
    height: 30px;

    background-color: rgb(207, 72, 68);
    color: white;

    border-radius: 10px 10px 0 0;
    box-shadow: none;
  }
  .container {
    width: 300px;

    border: 2px solid white;
    box-sizing: border-box;

    background-color: #ffcc00;

    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 5px;

    padding-top: 5px;
    padding-bottom: 5px;
  }

  .name {
    width: 265px;
    height: 30px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgb(207, 72, 68);
    border-radius: 10px;

    font-weight: bold;
    color: white;
  }

  .progress {
    width: 265px;
    height: 24px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 10px;
    border: 1px solid white;
    box-sizing: border-box;

    font-weight: bold;
  }
</style>
