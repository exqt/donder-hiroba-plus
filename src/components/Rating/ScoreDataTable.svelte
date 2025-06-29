<script lang="ts">
  import type { SortedScoreData } from './services/ScoreDataService'
  import { icons } from '../../assets'

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
    <span>Total Song Count: {scoreDataSorted.length}</span>
    <span>Total Play Count: {totalPlayCount}</span>

    <table class="play-count-table">
      <thead>
        <tr>
          <th>Name</th>
          <th style="width: 30px">Diff</th>
          <th style="width: 30px">
            <img src={icons.crowns.played} alt="Played" title="Played" />
          </th>
          <th style="width: 30px">
            <img src={icons.crowns.silver} alt="Clear" title="Clear" />
          </th>
          <th style="width: 30px">
            <img src={icons.crowns.gold} alt="Full Combo" title="Full Combo" />
          </th>
          <th style="width: 30px">
            <img src={icons.crowns.donderfull} alt="Donder Full" title="Donder Full" />
          </th>
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
            <td>
                <img src={score.difficulty === 'oni' ? icons.oni : icons.ura} alt={score.difficulty} title={score.difficulty}
                style="width: 30px; height: 30px; vertical-align: middle;"
            />
            </td>
            <td>{score.score.count.play}</td>
            <td>{score.score.count.clear}</td>
            <td>{score.score.count.fullcombo}</td>
            <td>{score.score.count.donderfullcombo}</td>
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

  .play-count-table th img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
</style>
