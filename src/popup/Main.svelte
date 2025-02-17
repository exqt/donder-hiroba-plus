<script lang="ts">
  import { WIDTH, HEIGHT } from '../constants'
  import './popup.css'

  import Profile from './Profile.svelte'
  import DonforceList from './DonforceList.svelte'
  import DonforceTable from './DonforceTable.svelte'
  import Settings from './Settings.svelte'

  import { icons } from '../assets'
  import { ScoreStorage } from '../lib/scores'
  import { SettingsStorage } from '../lib/settings'
  import { SongDB } from '../lib/songDB'
  import { onMount } from 'svelte'
  import I18N from '../lib/i18n'
  import Disclaimer from './Disclaimer.svelte'

  interface Tab {
    name: string
    icon: string
  }

  const TAB_HEIGHT = 30

  let songDB: SongDB
  let scoreStorage: ScoreStorage
  let settingsStorage: SettingsStorage
  let i18n: I18N

  const tabs: Tab[] = [
    { name: 'profile', icon: icons.account },
    { name: 'donforce-list', icon: icons.formatListNumbered },
    { name: 'donforce-table', icon: icons.table },
    { name: 'settings', icon: icons.cog }
  ]

  export let currentTabIdx = -1
  // eslint-disable-next-line yoda
  $: currentTabName = (0 <= currentTabIdx && currentTabIdx < tabs.length) ? tabs[currentTabIdx].name : ''

  let loaded = false
  onMount(async () => {
    songDB = await SongDB.getInstance()
    scoreStorage = await ScoreStorage.getInstance()
    settingsStorage = await SettingsStorage.getInstance()
    i18n = await I18N.getInstance()

    if (currentTabIdx === -1) {
      currentTabIdx = settingsStorage.lastTabIndex ?? 0
    }

    loaded = true

    if (!settingsStorage.disclaimerAgreed) {
      showDisclaimer = true
    }
  })

  const onClickTab = async (idx: number): Promise<void> => {
    currentTabIdx = idx
    settingsStorage.lastTabIndex = idx
    await settingsStorage.save()
  }

  let showDisclaimer = false
  const onAgree = async (): Promise<void> => {
    showDisclaimer = false
    settingsStorage.disclaimerAgreed = true
    await settingsStorage.save()
  }
</script>

<main style={`width: ${WIDTH}px; height: ${HEIGHT}px`}>
  {#if showDisclaimer}
    <Disclaimer on:agree={onAgree}/>
  {/if}

  <div class="tab-list" style={`height: ${TAB_HEIGHT}px`}>
    {#each tabs as tab, i}
      <button class="tab-item" class:active={currentTabIdx === i} on:click={async () => { await onClickTab(i) }} style={`height: ${TAB_HEIGHT}px`}>
        <img src={tab.icon} alt={tab.name}/>
      </button>
    {/each}
  </div>

  <div class="tab-content" style={`height: ${HEIGHT - TAB_HEIGHT}px`}>
    {#if loaded}
      {#if currentTabName === 'profile'}
        <Profile {settingsStorage} />
      {:else if currentTabName === 'donforce-list'}
        <DonforceList {songDB} />
      {:else if currentTabName === 'donforce-table'}
        <DonforceTable/>
      {:else if currentTabName === 'settings'}
        <Settings {settingsStorage} {scoreStorage} {songDB} {i18n} />
      {/if}
    {/if}
  </div>
</main>

<style>
  main {
    margin: 0 auto;
    text-align: center;

    background-color: #FFCC00;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .tab-list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #333;
    color: white;
  }

  .tab-item {
    background-color: var(--color1);
    color: white;
    border: none;
    transition: all 0.1s ease-in-out;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tab-item:hover {
    filter: brightness(0.8);
  }

  .tab-item.active {
    filter: brightness(0.8);
  }

  .tab-item img {
    filter: invert(1);
    height: 80%;
  }
</style>
