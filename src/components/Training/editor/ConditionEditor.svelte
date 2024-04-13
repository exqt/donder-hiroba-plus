<script lang="ts">
  import type { TrainingCourseCondition } from '../../../types'
  import { getContext } from 'svelte'
  import type I18N from '../../../lib/i18n'

  export let condition: TrainingCourseCondition
  export let removeCondition: () => void

  // eslint-disable-next-line
  const i18n = getContext('i18n') as Promise<I18N>
</script>

{#await i18n then i18n}
<div class="container">
  <button on:click={removeCondition}>X</button>
  <select bind:value={condition.type}>
    <option value="good">{i18n.t('良')}</option>
    <option value="ok">{i18n.t('可')}</option>
    <option value="bad">{i18n.t('不可')}</option>
    <option value="combo">{i18n.t('コンボ')}</option>
    <option value="roll">{i18n.t('連打')}</option>
    <option value="hit">{i18n.t('叩けた数')}</option>
  </select>
  <input type="number" min="1" step="1" bind:value={condition.criterion} />
  <span>
    {condition.type === 'ok' || condition.type === 'bad' ? i18n.t('未満') : i18n.t('以上')}
  </span>
</div>
{/await}

<style>
  button {
    width: 30px !important;
    height: 16px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container {
    border: 2px solid rgba(255, 255, 255, 0.5);
    width: 265px;

    display: flex;
    flex-direction: row;
    column-gap: 3px;
    align-items: center;
  }

  input {
    width: 70px;
  }
  span {
    width: 50px;
  }
</style>
