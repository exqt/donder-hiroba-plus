<script lang="ts">
    import type { TrainingCourseCondition } from '../../../types'

    export let condition: TrainingCourseCondition
    export let removeCondition: () => void
</script>

<div class="container">
    <button on:click={removeCondition}>X</button>
    <select bind:value={condition.type}>
        <option value="good">량</option>
        <option value="ok">가</option>
        <option value="bad">불가</option>
        <option value="combo">콤보</option>
        <option value="roll">연타</option>
        <option value="hit">두드린 횟수</option>
    </select>
    <input type="number" min="1" step="1" bind:value={condition.criterion}/>
    <span>
        개 {condition.type === 'ok' || condition.type === 'bad' ? '미만' : '이상'}
    </span>
</div>

<style>
    button{
        width:30px !important;
        height:16px;

        display:flex;
        justify-content: center;
        align-items: center;
    }
    .container {
        border: 2px solid rgba(255, 255, 255, 0.5);
        width: 265px;

        display:flex;
        flex-direction: row;
        column-gap:3px;
        align-items: center;
    }

    input{
        width:70px;
    }
    span{
        width:50px;
    }
</style>
