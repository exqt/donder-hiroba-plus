<script lang="ts">
  import type { Language } from '../types'
  import DisclaimerEn from './Disclaimer/DisclaimerEN.svelte'
  import DisclaimerKO from './Disclaimer/DisclaimerKO.svelte'
  import { SettingsStorage } from '../lib/settings'

  let lang: Language = 'en'
  const setLang = (l: Language): void => {
    lang = l
  }

  let showDisclaimer = true

  const onAgree = async (): Promise<void> => {
    showDisclaimer = false
    const settings = await SettingsStorage.getInstance()
    settings.disclaimerAgreed = true
    await settings.save()
  }
</script>

{#if showDisclaimer}
  <div class="wrapper">
    <div>
      <button on:click={() => { setLang('en') }}>English</button>
      <button on:click={() => { setLang('ko') }}>한국어</button>
    </div>
    <div>
      {#if lang === 'en'}
        <DisclaimerEn on:agree={onAgree}/>
      {/if}
      {#if lang === 'ko'}
        <DisclaimerKO on:agree={onAgree}/>
      {/if}
    </div>
  </div>
{/if}

<style>
  .wrapper {
    background-color: #000a;
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
</style>
