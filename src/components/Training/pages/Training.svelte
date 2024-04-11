<script lang="ts">
    import { ScoreStorage } from '../../../lib/scores'
    import TrainingCourseStorage from '../../../lib/trainingCourse'
    import { SongDB } from '../../../lib/songDB'
    import Course from '../view/Course.svelte'
    import { link, location } from 'svelte-spa-router'

    let reloading = false
    function reload (): void {
      reloading = !reloading
    }

    let json: string
    async function importCourse (json: string): Promise<void> {
      const storage = await TrainingCourseStorage.getInstance()
      storage.add(TrainingCourseStorage.parse(json))
      await storage.save()
      console.log('불러오기 완료')
      reload()
    }
</script>

<a href="/training/add" use:link>추가</a>
<div class="load-container">
    <input type="text" bind:value={json} placeholder="json"/>
    <button on:click={async () => { await importCourse(json) }}>불러오기</button>
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
