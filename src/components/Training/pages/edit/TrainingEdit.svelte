<script lang="ts">
    import TrainingCourseStorage from '../../../../lib/trainingCourse'
    import CourseEditor from '../../editor/CourseEditor.svelte'

    export let params: { hash: string }
</script>

{#await TrainingCourseStorage.getInstance() then storage}
    <CourseEditor course={storage.get(Number(params.hash))} mode="edit"/>
{/await}
