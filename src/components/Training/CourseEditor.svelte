<script lang="ts">
    import { push } from 'svelte-spa-router'
    import TrainingCourseStorage from '../../lib/trainingCourse'
    import type { TrainingCourse } from '../../types'
    import CourseSong from './CourseSong.svelte'

    export let course: TrainingCourse = {
      name: '',
      hash: 0,
      songs: []
    }

    function addSong (): void {
      course.songs = [...course.songs, {
        songNo: 0,
        difficulty: 'oni',
        conditions: []
      }]
    }

    function removeSong (index: number): void {
      course.songs = course.songs.filter((_, i) => i !== index)
    }

    async function save (): Promise<void> {
      course.hash = TrainingCourseStorage.createHash(course.name, course.hash)
      const storage = await TrainingCourseStorage.getInstance()
      storage.add(course)
      await storage.save()
      await push('/training')
    }
</script>

<div class="name-container">
  <input type="text" placeholder="이름" bind:value={course.name}/>
  <button on:click={save} disabled={course.name === '' || course.songs.length === 0 || course.songs.some(song => song.songNo === 0)}>저장</button>
</div>

<span>
  곡
  <button on:click={addSong}>+</button>
</span>
{#each course.songs as song, index}
    <CourseSong bind:song removeSong={() => { removeSong(index) }}/>
{/each}

<style>
  .name-container{
    width:300px;
  }
</style>
