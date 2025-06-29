<script lang="ts">
  import type { SortedScoreData } from './services/ScoreDataService'
  import { DIFFICULTY_COLORS } from '../../constants'

  export let scoreDataSorted: SortedScoreData[]
  export let totalPlayCount: string
  export let lastUpdated: string | null
  export let onClearCache: () => Promise<void>

  let openPlayCount: boolean = false
</script>

<div class="score-data-section">
  <div style="margin-top: 50px;">
    <span>Last Score Updated: <br> {lastUpdated}</span>
  </div>

  <button on:click={onClearCache}>
    Clear Cache
  </button>

  <button on:click={() => { openPlayCount = !openPlayCount }}>
    Play Count (click to expand)
  </button>

  {#if openPlayCount}
    <span>Count: {scoreDataSorted.length}</span>
    <span>Total Play Count: {totalPlayCount}</span>

    <table class="play-count-table">
      <thead>
        <tr>
          <th>Name</th>
          <th style="width: 60px">Diff</th>
          <th style="width: 100px">Count</th>
        </tr>
      </thead>
      <tbody>
        {#each scoreDataSorted as score, i}
          <tr>
            <td style="max-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <a href={`https://donderhiroba.jp/score_detail.php?song_no=${score.songNo}&level=${score.difficulty === 'oni' ? 4 : 5}`} target="_blank">
                ({score.songNo}) {score.songName}
              </a>
            </td>
            <td
              style={`color: ${DIFFICULTY_COLORS[score.difficulty === 'oni' ? 3 : 4]}; font-weight: bold;`}
            >{score.difficulty}</td>
            <td>{score.score.count.play} / {score.score.count.clear} / {score.score.count.fullcombo} / {score.score.count.donderfullcombo}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .score-data-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .play-count-table {
    width: 100%;
    max-width: 600px;
    border: 1px solid black;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .play-count-table th,
  .play-count-table td {
    border: 1px solid black;
    padding: 5px;
    text-align: center;
  }
</style>
