<script lang="ts">
  import type { Language } from '../types'
  import DisclaimerEn from './Disclaimer/DisclaimerEN.svelte'
  import DisclaimerJa from './Disclaimer/DisclaimerJA.svelte'
  import DisclaimerKO from './Disclaimer/DisclaimerKO.svelte'

  let lang: Language = 'en'
  const setLang = (l: Language): void => {
    lang = l
  }
</script>

<div class="wrapper">
  <div>
    <button on:click={() => { setLang('en') }}>English</button>
    <button on:click={() => { setLang('ko') }}>한국어</button>
    <button on:click={() => { setLang('ja') }}>日本語</button>
  </div>
  <div class="content">
    {#if lang === 'en'}
      <DisclaimerEn on:agree/>
    {/if}
    {#if lang === 'ko'}
      <DisclaimerKO on:agree/>
    {/if}
    {#if lang === 'ja'}
      <DisclaimerJa on:agree/>
    {/if}
  </div>
</div>

<style>
  .wrapper {
    background-color: #000d;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 24px;
    z-index: 10;
    color: white;
  }

  .content {
    margin-top: 24px;
    width: 80%;
  }
</style>
