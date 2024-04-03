<script lang="ts" context="module">
    async function reset(){
        const storage = chrome?.storage?.local
        if(storage === undefined) return;

        await storage.set({trainings: {courses: []}})
        location.reload()
    }

    async function loadTrainingCourses(){
        const storage = chrome?.storage?.local
        if(storage === undefined) return [];

        let data = (await storage.get()).trainings.courses as TrainingCourse[]

        if(!data){
            data = [];
        }

        return data;
    }

    async function getSong(songNo:number){
        return ((await import('../../songdata.json') as any).default as Record<string, SongData>)[songNo]
    }
</script>
<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { SongData, TrainingCourse } from "../../types";
    import { link } from "svelte-spa-router";
    import { icons } from "../../assets";

    const title = getContext('title') as Writable<string>;
    $title = "훈련"
    let input:HTMLInputElement
</script>

<input type="text" bind:this={input}>
<div class="button-container">
    <div class="import">
        ↓ 불러오기 ↓
    </div>
    <div class="add">
        <a href="/training/add" use:link>추가</a>
    </div>
    <div class="reset" on:click={reset} role="presentation">
        초기화
    </div>
</div>
{#await loadTrainingCourses()}
    로딩중...
{:then courses}
    {#each courses as course}
        {course.title}
        <div class="course">
            {#each course.songs as song}
                {#await getSong(song.songNo) then songData}
                    {songData.title}
                {/await}
            {/each}
        </div>
    {/each}
{/await}

<style>
    input{
        width:300px;
    }

    div.button-container{
        width:300px;
        display:flex;
        flex-direction: row;
        column-gap: 10px;
    }

    div.import, div.add{
        width:100px;
        cursor: pointer;
        display:flex;
        justify-content: center;
        align-items: center;
    }

    div.course{
        width:300px;
    }
</style>