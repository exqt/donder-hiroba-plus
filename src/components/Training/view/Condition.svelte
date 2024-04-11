<script lang="ts">
    import type { SongScoreDetail, TrainingCourseCondition } from '../../../types'

    export let condition: TrainingCourseCondition
    export let score: SongScoreDetail | undefined
    export let addAchievedCondition: () => void

    function checkCondition (condition: TrainingCourseCondition, score: SongScoreDetail | undefined): boolean {
      if (score?.best === undefined) {
        return false
      }
      switch (condition.type) {
        case 'good': {
          return score.best?.good >= condition.criterion
        }
        case 'ok': {
          return score.best?.ok < condition.criterion
        }
        case 'bad': {
          return score.best?.ng < condition.criterion
        }
        case 'combo': {
          return score.best?.combo >= condition.criterion
        }
        case 'roll': {
          return score.best?.pound >= condition.criterion
        }
        case 'hit':
          return score.best?.hit >= condition.criterion
      }
    }

    function getTypeName (type: TrainingCourseCondition['type']): string {
      switch (type) {
        case 'good': return '량'
        case 'ok': return '가'
        case 'bad': return '불가'
        case 'combo': return '콤보'
        case 'roll': return '연타'
        case 'hit': return '두드린 횟수'
      }
    }

    if (checkCondition(condition, score)) addAchievedCondition()
</script>

<div class="condition">
    {#if checkCondition(condition, score)}
    ✅
    {:else}
    ❌
    {/if}
    {getTypeName(condition.type)}
    {condition.criterion}개
    {condition.type === 'ok' || condition.type === 'bad' ? '이하' : '이상'}
</div>

<style>
    .condition{
        width:100%;

        display:flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }
</style>
