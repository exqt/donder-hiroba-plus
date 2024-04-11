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
    <option value="good">{i18n.t('Good')}</option>
    <option value="ok">{i18n.t('Ok')}</option>
    <option value="bad">{i18n.t('Bad')}</option>
    <option value="combo">{i18n.t('Combo')}</option>
    <option value="roll">{i18n.t('Roll')}</option>
    <option value="hit">{i18n.t('Hit')}</option>
  </select>
  <input type="number" min="1" step="1" bind:value={condition.criterion} />
  <span>
    {condition.type === 'ok' || condition.type === 'bad' ? i18n.t('Under') : i18n.t('Over')}
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
