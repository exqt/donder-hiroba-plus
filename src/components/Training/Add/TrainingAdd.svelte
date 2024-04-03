<script lang="ts">
    import { push } from "svelte-spa-router";
    import type { TrainingCourse } from "../../../types";
    import TrainingCourseEditor from "../TrainingCourseEditor.svelte";

    let course:TrainingCourse;

    async function save(){
        if(course.songs.length === 0) push('/training');
        const storage = chrome?.storage?.local
        if(storage === undefined){
            alert("no Storage");
            push('/training')
        }

        let data = (await storage.get()).trainings.courses as TrainingCourse[]

        if(!data){
            data = [];
        }

        data.push(course);

        await storage.set({trainings: {courses: data}})

        push('/training')
    }
</script>


<div class="save" role="presentation" on:click={save}>
    저장
</div>
<TrainingCourseEditor bind:course={course}/>