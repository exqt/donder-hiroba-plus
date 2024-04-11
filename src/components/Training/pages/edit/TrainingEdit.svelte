<script lang="ts">
    import TrainingCourseStorage from '../../../../lib/trainingCourse'
    import CourseEditor from '../../editor/CourseEditor.svelte'
    import { getContext } from 'svelte'
    import { type Writable } from 'svelte/store'

    // eslint-disable-next-line
    (getContext('title') as Writable<string>).set('훈련 코스 수정')

    export let params: { hash: string }
</script>

{#await TrainingCourseStorage.getInstance() then storage}
    <CourseEditor course={storage.get(Number(params.hash))} mode="edit"/>
{/await}
