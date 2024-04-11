<script lang="ts">
  import { push } from 'svelte-spa-router'
  import TrainingCourseStorage from '../../../lib/trainingCourse'
  import type { TrainingCourse } from '../../../types'
  import SongEditor from './SongEditor.svelte'
  import { SongDB } from '../../../lib/songDB'
  import { getContext } from 'svelte'
  import type I18N from '../../../lib/i18n'

  export let course: TrainingCourse = {
    name: '',
    hash: 0,
    songs: []
  }
  export let mode: 'edit' | 'add' = 'add'

  function addSong (): void {
    course.songs = [
      ...course.songs,
      {
        songNo: 0,
        difficulty: 'oni',
        conditions: []
      }
    ]
  }

  function removeSong (index: number): void {
    course.songs = course.songs.filter((_, i) => i !== index)
  }

  async function save (): Promise<void> {
    course.hash = TrainingCourseStorage.createHash(course.name, course.hash)
    const storage = await TrainingCourseStorage.getInstance()
    if (mode === 'add') storage.add(course)
    await storage.save()
    await push('/training')
  }

  // eslint-disable-next-line
  const i18n = getContext("i18n") as Promise<I18N>;
</script>

{#await i18n then i18n}
  <div class="name-container">
    <input type="text" placeholder="이름" bind:value={course.name} />
    <button
      on:click={save}
      disabled={course.name === '' ||
        course.songs.length === 0 ||
        course.songs.some((song) => song.songNo === 0)}>{i18n.t('Save')}</button
    >
  </div>

  <span>
    {i18n.t('Song')}
    <button on:click={addSong}>+</button>
  </span>
  {#await SongDB.getInstance() then songDB}
    {#each course.songs as song, index}
      <SongEditor
        bind:song
        removeSong={() => {
          removeSong(index)
        }}
        {songDB}
      />
    {/each}
  {/await}
{/await}

<style>
  .name-container {
    width: 300px;
    display: flex;
    justify-content: center;
  }
</style>
