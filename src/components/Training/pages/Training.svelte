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
</script>

<a href="/training/add" use:link>추가</a>
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
