<script lang="ts">
  import { type ScoreStorage } from '../lib/scores'
  import { onMount } from 'svelte'
  import { SongDB } from '../lib/songDB'
  import { getDonforceTopK } from '../lib/donforce'
  import { DIFFICULTY_TO_INDEX, DIFFICULTY_COLORS, DONFORCE_NUMBER_OF_RECORDS } from '../constants'
  import type { DifficultyType, DonforceItem, SongScore } from '../types'
  import { getSongDetailLink } from '../lib/songs'
  import DonforceItemComponent from '../components/Popup/DonforceItemComponent.svelte'
  import type { SettingsStorage } from '../lib/settings'
  import { Analyzer } from '../lib/analyzer'

  export let scoreStorage: ScoreStorage
  export let settingsStorage: SettingsStorage
  export let songDB: SongDB
  let analyzer: Analyzer

  let scores: SongScore[] = []
  let items: DonforceItem[] = []

  let totalDonforce = 0
  let diffs: DifficultyType[] = []

  onMount(async () => {
    songDB = await SongDB.getInstance()
    analyzer = await Analyzer.getInstance()
    scores = scoreStorage.getAllScores()

    diffs = [settingsStorage.preferringDifficulty ?? 'oni']
    if (diffs[0] === 'oni') diffs.push('oni_ura')

    items = getDonforceTopK(scores, songDB, analyzer, diffs, DONFORCE_NUMBER_OF_RECORDS)
    totalDonforce = items.reduce((acc, item) => acc + item.donforce, 0) / DONFORCE_NUMBER_OF_RECORDS
  })

  const loadAll = (): void => {
    items = getDonforceTopK(scores, songDB, analyzer, diffs, scores.length)
  }
</script>

<div class="wrapper">
  <div class="top">
    <span class="top-text">DONFORCE 💪: {totalDonforce.toFixed(3)}</span>
  </div>

  <div class="score-container">
    {#each items as item, i (item.songNo + item.difficulty)}
      {@const color = DIFFICULTY_COLORS[DIFFICULTY_TO_INDEX[item.difficulty]]}
      {@const songData = songDB.getSongData(item.songNo)}
      {@const detail = scoreStorage.getScoreByNo(item.songNo)?.details[item.difficulty]}
      {@const link = getSongDetailLink(item.songNo, item.difficulty)}
      {@const level = analyzer.getLevelWidthSub(item.songNo, item.difficulty)}
      <DonforceItemComponent {item} {i} {songData} {detail} {link} {color} {level} />
    {/each}
    {#if items.length !== scores.length}
      <button on:click={loadAll}>Load All</button>
    {/if}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .top {
    margin: 12px 0px;
  }

  .top-text {
    font-size: 20px;
  }

  .score-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto; /* Add this if you want .score-container to be scrollable when its content overflows */
  }
</style>
