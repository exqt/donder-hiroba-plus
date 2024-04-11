<script lang="ts">
    import { ScoreStorage } from '../../../lib/scores'
    import TrainingCourseStorage from '../../../lib/trainingCourse'
    import { SongDB } from '../../../lib/songDB'
    import Course from '../view/Course.svelte'
    import { push, location } from 'svelte-spa-router'
    import { getContext } from 'svelte'
    import type { Writable } from 'svelte/store'

    let reloading = false
    function reload (): void {
      reloading = !reloading
    }

    let jsonInput: HTMLInputElement
    async function importCourse (json: string): Promise<void> {
      const storage = await TrainingCourseStorage.getInstance()
      storage.add(TrainingCourseStorage.parse(json))
      await storage.save()
      console.log('불러오기 완료')
      jsonInput.value = ''
      reload()
    }

    // eslint-disable-next-line
    (getContext('title') as Writable<string>).set('훈련 코스')
</script>

<div class="load-container">
    <input type="text" bind:this={jsonInput} placeholder="json"/>
    <button on:click={async () => { await importCourse(jsonInput.value) }}>불러오기</button>
    <button on:click={async () => { await push('/training/add') }}>추가</button>
</div>
{#key $location}
    {#await Promise.all([TrainingCourseStorage.getInstance(), ScoreStorage.getInstance(), SongDB.getInstance()]) then [courseStorage, scoreStorage, songDB]}
        {#key reloading}
            {#each courseStorage.getAll() as course}
                <Course
                    {course}
                    {scoreStorage}
                    {songDB}
                    {courseStorage}
                    {reload}
                />
            {/each}
        {/key}
    {/await}
{/key}

<style>
    .load-container{
        width:300px;
        display:flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .load-container input{
        width:170px;
    }
</style>
