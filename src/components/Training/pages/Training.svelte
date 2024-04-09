<script lang="ts">
    import TrainingCourseStorage from '../../../lib/trainingCourse'
    import Course from '../Course.svelte'
    import { link } from 'svelte-spa-router'
</script>

<a href="/training/add" use:link>추가</a>
{#await TrainingCourseStorage.getInstance() then storage}
    {#each storage.getAll() as course}
        <Course {course}/>
    {/each}
{/await}
