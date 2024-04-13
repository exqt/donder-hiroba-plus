<script lang="ts">
  import { getContext } from 'svelte'
  import type I18N from '../../../lib/i18n'
  import type {
    SongScoreDetail,
    TrainingCourseCondition
  } from '../../../types'

  export let condition: TrainingCourseCondition
  export let score: SongScoreDetail | undefined
  export let addAchievedCondition: () => void

  function checkCondition (
    condition: TrainingCourseCondition,
    score: SongScoreDetail | undefined
  ): boolean {
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

  function getTypeName (
    type: TrainingCourseCondition['type'],
    i18n: I18N
  ): string {
    switch (type) {
      case 'good':
        return i18n.t('良')
      case 'ok':
        return i18n.t('可')
      case 'bad':
        return i18n.t('不可')
      case 'combo':
        return i18n.t('コンボ')
      case 'roll':
        return i18n.t('連打')
      case 'hit':
        return i18n.t('叩けた数')
    }
  }

  if (checkCondition(condition, score)) addAchievedCondition()

  // eslint-disable-next-line
  const i18n = getContext("i18n") as Promise<I18N>;
</script>

{#await i18n then i18n}
  <div class="condition">
    <span>
      {#if checkCondition(condition, score)}
        ✅
      {:else}
        ❌
      {/if}
      {getTypeName(condition.type, i18n)}
      <span
        style={`color:${checkCondition(condition, score) ? '#00d26a' : '#c70000'};`}
        >{condition.criterion}</span
      >
      {condition.type === 'ok' || condition.type === 'bad'
        ? i18n.t('未満')
        : i18n.t('以上')}
    </span>
  </div>
{/await}

<style>
  .condition {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    margin-top: 5px;
    font-weight: bold;
  }
</style>
