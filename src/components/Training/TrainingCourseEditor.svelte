<script lang="ts" context="module">
    function addSong(course:TrainingCourse){
        const song:TrainingSong = {
            songNo: 1,
            difiiculty: "oni",
            conditions: [{
                name:"good",
                criteria: 130,
                type:"more"
            }]
        }
        
        course.songs.push(song)
        return course
    }
</script>
<script lang="ts">
    import type { TrainingCourse, TrainingSong } from "../../types";

    export let course:TrainingCourse = {
        title: "",
        songs: []
    }
</script>

<input type="text" bind:value={course.title}>
{#each course.songs as song}
{JSON.stringify(song)}
{/each}
<div class="add" role="presentation" on:click={() => {course = addSong(course)}}>
    + 곡추가
</div>