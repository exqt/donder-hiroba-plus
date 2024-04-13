<script lang="ts">
  import { type SongScoreDetailBest } from '../../../types'
  import { getContext } from 'svelte'
  import type I18N from '../../../lib/i18n'

  export let best: SongScoreDetailBest

  const keys: Array<keyof SongScoreDetailBest> = ['good', 'pound', 'ok', 'combo', 'ng', 'hit']

  // eslint-disable-next-line
  const i18n = getContext("i18n") as Promise<I18N>;
</script>

{#await i18n then i18n}
<div class="container">
  <div class="title">
  {i18n.t('ベストスコア')}
  </div>
  <div class="score">
  {best.score}{i18n.t('点')}
  </div>
  {#each keys as key}
  <div class="data">
  <img src={`image/sp/640/score_name_${key.toString()}_640.png`} alt="icon">
  {best[key]}{i18n.t('回')}
  </div>
  {/each}
</div>
{/await}

<style>
  .container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: center;
  column-gap: 10px;
  row-gap: 3px;
  }

  .title{
  width:100%;
  text-align: center;
  font-weight: bold;
  }

  .score{
  width: 240px;
  height:35px;
  background-image: url('image/sp/640/score_back_0_640.png');
  background-size: 100% 100%;

  color:white;
  font-weight: bold;
  font-size: 18px;

  display:flex;
  align-items: center;
  justify-content: center;

  padding-top: 3px;
  }

  .data{
  width:117px;

  display:flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: white;

  box-sizing: border-box;
  padding-inline: 2px;
  }

  .data > img{
  width:auto;
  height:18px;
  }
</style>
