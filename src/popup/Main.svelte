<script lang="ts">
  import { WIDTH, HEIGHT } from '../constants'
  import './popup.css'

  import Profile from './Profile.svelte'
  import DonforceList from './DonforceList.svelte'
  import DonforceTable from './DonforceTable.svelte'
  import Settings from './Settings.svelte'
  import NotLogined from './NotLogined.svelte'

  import { icons } from '../assets'
  import { ExtensionStorage } from '../lib/storage'
  import { SongDB } from '../lib/songDB'
  import { onMount } from 'svelte'

  interface Tab {
    name: string
    icon: string
  }

  const TAB_HEIGHT = 30

  let songDB: SongDB
  let storage: ExtensionStorage

  const tabs: Tab[] = [
    {
      name: 'profile',
      icon: icons.account
    },
    {
      name: 'donforce-list',
      icon: icons.formatListNumbered
    },
    {
      name: 'donforce-table',
      icon: icons.table
    },
    {
      name: 'settings',
      icon: icons.cog
    }
  ]

  export let currentTabIdx = -1
  // eslint-disable-next-line yoda
  $: currentTabName = (0 <= currentTabIdx && currentTabIdx < tabs.length) ? tabs[currentTabIdx].name : ''

  let loaded = false
  onMount(async () => {
    songDB = await SongDB.getInstance()
    if (currentTabIdx === -1) {
      storage = await ExtensionStorage.getInstance()
      currentTabIdx = storage.settings.lastTabIndex ?? 0
    }
    loaded = true
  })

  const onClickTab = async (idx: number): Promise<void> => {
    currentTabIdx = idx
    storage.settings.lastTabIndex = idx
    await storage.save()
  }
</script>

<main style={`width: ${WIDTH}px; height: ${HEIGHT}px`}>
  {#if loaded && storage.donderInfo.id === undefined}
    <NotLogined/>
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
        <Profile
          storage={storage}
        />
      {:else if currentTabName === 'donforce-list'}
        <DonforceList
          storage={storage}
          songDB={songDB}
        />
      {:else if currentTabName === 'donforce-table'}
        <DonforceTable/>
      {:else if currentTabName === 'settings'}
        <Settings
          storage={storage}
        />
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
