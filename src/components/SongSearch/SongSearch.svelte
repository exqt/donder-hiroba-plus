<script lang="ts">
  import SongList from './SongList.svelte'
  import SearchSort from './SearchSort.svelte'
  import SearchFilter from './SearchFilter.svelte'
  import LevelRangeInput from './LevelRangeInput.svelte'
  import SearchText from './SearchText.svelte'
  import DifficultySelect from './DifficultySelect.svelte'

  import { BADGES, CROWNS, DIFFICULTIES, WIDTH } from '../../constants'
  import type { BadgeType, CrownType, SongScore, SearchOptions, SortOptions, DifficultyType, GenreType } from '../../types'
  import { writable, type Writable } from 'svelte/store'
  import { SongDB } from '../../lib/songDB'
  import { SettingsStorage } from '../../lib/settings'
  import { onMount } from 'svelte'
  import { sortAndFilter } from './sortAndFilter'
  import { PlaylistsStore } from '../../lib/playlist'
  import { Analyzer } from '../../lib/analyzer'

  export let scores: SongScore[] = []

  let genre: GenreType = 'jpop'
  const genreMap: Record<string, GenreType> = { 2: 'anime', 3: 'kids', 4: 'vocaloid', 5: 'game', 6: 'namco', 7: 'variety', 8: 'classic' }

  const genreInURL = window.location.search.match(/genre=(\d+)/)
  if (genreInURL !== null) {
    const idx = parseInt(genreInURL[1])
    genre = genreMap[idx]
  }

  const searchDifficulties: Writable<Record<DifficultyType, boolean>> = writable({
    easy: false,
    normal: false,
    hard: false,
    oni: true,
    oni_ura: true
  })

  const searchOptions: Writable<SearchOptions> = writable({
    text: '',
    crown: {
      none: true,
      silver: true,
      gold: true,
      donderfull: true
    },
    badge: {
      0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true
    },
    minLevel: 60,
    maxLevel: 109
  })

  const sortOptions: Writable<SortOptions> = writable({
    key: '',
    inc: true
  })

  const isDefaultOptions = (searchOptions: SearchOptions, sortOptions: SortOptions): boolean => {
    return searchOptions.text === '' &&
      searchOptions.crown.none &&
      searchOptions.crown.silver &&
      searchOptions.crown.gold &&
      searchOptions.crown.donderfull &&
      searchOptions.badge[1] &&
      searchOptions.badge[2] &&
      searchOptions.badge[3] &&
      searchOptions.badge[4] &&
      searchOptions.badge[5] &&
      searchOptions.badge[6] &&
      searchOptions.badge[7] &&
      searchOptions.badge[8] &&
      searchOptions.minLevel === 60 &&
      searchOptions.maxLevel === 109 &&
      sortOptions.key === '' &&
      sortOptions.inc
  }

  const badgeCounts: Record<BadgeType, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
  const crownCounts: Record<CrownType, number> = { none: 0, silver: 0, gold: 0, donderfull: 0 }

  $: {
    BADGES.forEach((badge) => { badgeCounts[badge] = 0 })
    CROWNS.forEach((crown) => { crownCounts[crown] = 0 })

    const diffs: DifficultyType[] = []
    for (const diff of DIFFICULTIES) {
      if ($searchDifficulties[diff]) {
        diffs.push(diff)
      }
    }

    for (const score of scores) {
      for (const diff of diffs) {
        const detail = score.details[diff]
        if (detail === undefined) continue
        badgeCounts[detail.badge] += 1
        crownCounts[detail.crown] += 1
      }
    }
  }

  let filteredSortedScores: SongScore[] = []

  let songDB: SongDB
  let analyzer: Analyzer
  let settingsStorage: SettingsStorage
  let playlists: PlaylistsStore
  const taikoNo = window.location.search.match(/taiko_no=(\d+)/)?.[1]

  let loaded = false
  onMount(async () => {
    songDB = await SongDB.getInstance()
    analyzer = await Analyzer.getInstance()
    settingsStorage = await SettingsStorage.getInstance()
    playlists = await PlaylistsStore.getInstance()
    loaded = true

    const preferringDifficulty = settingsStorage.preferringDifficulty ?? 'oni'
    let difficulties = { easy: false, normal: false, hard: false, oni: false, oni_ura: false }
    if (preferringDifficulty === 'easy') difficulties = { ...difficulties, easy: true }
    else if (preferringDifficulty === 'normal') difficulties = { ...difficulties, normal: true }
    else if (preferringDifficulty === 'hard') difficulties = { ...difficulties, hard: true }
    else if (preferringDifficulty === 'oni') difficulties = { ...difficulties, oni: true, oni_ura: true }
    searchDifficulties.set(difficulties)
  })

  $: {
    if (loaded) {
      filteredSortedScores = sortAndFilter(
        $searchOptions,
        $sortOptions,
        $searchDifficulties,
        songDB,
        analyzer,
        settingsStorage,
        scores,
        !isDefaultOptions($searchOptions, $sortOptions)
      )
    }
  }

  let optionOpen = false
</script>

<div class="wrapper" style={`width: ${WIDTH}px;`}>
  <button class="toggle-option" on:click={() => { optionOpen = !optionOpen }}>
    { optionOpen ? '▼' : '▶' } Advanced Search Options
  </button>
  {#if optionOpen}
    <div class="options">
      <SearchText {searchOptions} />
      <DifficultySelect {searchDifficulties} />
      <SearchSort {sortOptions} />
      <SearchFilter {searchOptions} {badgeCounts} {crownCounts} />
      <LevelRangeInput {searchOptions} />
    </div>
  {/if}
  {#if loaded}
    <SongList
      songScores={filteredSortedScores}
      {settingsStorage}
      genre={genre}
      songDB={songDB}
      playlists={playlists}
      taikoNo={taikoNo}
      analyzer={analyzer}
    />
  {/if}
</div>

<style>
  .wrapper {
    background-color: none;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .toggle-option {
    background-color: #e92;
    text-align: center;
    margin-bottom: 12px;
    box-shadow: none;
    border: none;
  }

  .options {
    user-select: none;
    background-color: #e92;
    padding: 8px;
    margin-bottom: 12px;
  }
</style>
