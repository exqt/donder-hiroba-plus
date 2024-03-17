<script lang="ts">
  import { type ExtensionStorage } from '../lib/storage'
  import { onMount } from 'svelte'
  import { SongDB } from '../lib/songDB'
  import { getDonforceLevel, getDonforceTopK } from '../lib/donforce'
  import { DIFFICULTY_TO_INDEX, DIFFICULTY_COLORS, DONFORCE_NUMBER_OF_RECORDS } from '../constants'
  import { icons } from '../assets'
  import type { DonforceItem, SongScore } from '../types'
  import { getSongDetailLink } from '../lib/songs'

  export let storage: ExtensionStorage
  export let songDB: SongDB

  let scores: SongScore[] = []
  let items: DonforceItem[] = []

  let totalDonforce = 0

  onMount(async () => {
    songDB = await SongDB.getInstance()
    scores = storage.getAllScores()

    const diffs = [storage.settings.preferringDifficulty ?? 'oni']
    if (diffs[0] === 'oni') diffs.push('oni_ura')

    items = getDonforceTopK(scores, songDB, diffs, DONFORCE_NUMBER_OF_RECORDS)
    totalDonforce = items.reduce((acc, item) => acc + item.donforce, 0) / DONFORCE_NUMBER_OF_RECORDS
  })

</script>

<div class="wrapper">
  <div class="top">
    <span class="top-text">DONFORCE 💪: {totalDonforce.toFixed(3)}</span>
  </div>

  <div class="score-container">
    {#each items as item, i}
      {@const color = DIFFICULTY_COLORS[DIFFICULTY_TO_INDEX[item.difficulty]]}
      {@const songData = songDB.getSongData(item.songNo)}
      {@const detail = storage.getScoreByNo(item.songNo)?.details[item.difficulty]}
      {@const link = getSongDetailLink(item.songNo, item.difficulty)}
      {#if detail}
        <a href={`${link}`} target="_blank">
          <div class="card" style={`background-color: ${color}`}>
            <span> {item.title} (#{i + 1}) </span>
            <div class="items">
              {#if songData?.levels[item.difficulty]}
                {@const level = getDonforceLevel(songData, item.difficulty)}
                <span> ★ {level.toFixed(1)} </span>
                <span class="divider"> | </span>
                <span> 💪 {item.donforce.toFixed(3)} </span>
                <span class="divider"> | </span>
              {/if}
              <img class="icon" src={icons.badges[detail.badge]} alt={'badge-' + detail.badge}/>
              <img class="icon" src={icons.crowns[detail.crown]} alt={detail.crown}/>
            </div>
          </div>
        </a>
      {/if}
    {/each}
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

  .card {
    padding: 4px 0px;
    margin: 4px 4px;
    border-radius: 8px;
    color: white;
  }

  .items {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 4px 0px;
  }

  .divider {
    margin: 0px 4px;
  }

  .icon {
    height: 22px;
  }
</style>
