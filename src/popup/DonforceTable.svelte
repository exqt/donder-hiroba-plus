<script lang="ts">

  import Switch from '../components/Common/Switch.svelte'

  import { icons } from '../assets'
  import { getSongRating } from '../lib/rating'
  import type { Crown } from 'node-hiroba/types'

  let stars = 10
  let subStar = 0
  let perSong = false
  let accuracy = 95.0

  $: measureValue = stars + subStar / 10

  const CROWNS = ['donderfull', 'gold', 'silver', 'played'] as Crown[]
</script>

<div class="wrapper">
  <div class="level-button-containers">
    <div class="level-button-container">
      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as i}
        <button
          class="level-button"
          class:active={stars === i}
          on:click={() => { stars = i }}
        >
          {i}
        </button>
      {/each}
    </div>
    <div class="level-button-container">
      {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as i}
        <button
          class="level-button"
          class:active={subStar === i}
          on:click={() => { subStar = i }}
        >
          .{i}
        </button>
      {/each}
    </div>
  </div>

  <div style="display: flex; align-items: center;">
    <p class="level-text">Measure: {(stars + subStar / 10).toFixed(1)}</p>
    <a href="https://taiko.wiki/rating/measure" target="_blank" style="margin-left: 8px;">
      (?)
    </a>
  </div>

  <Switch bind:checked={perSong} label={' / 50'}/>

  <label for="accuracy">Accuracy: {accuracy.toFixed(1)}%</label>
  <input type="range" min="60" max="105" step="0.1" bind:value={accuracy} />

  <div class="rating-value-container">
    {#each CROWNS as crown}
      {#if crown !== null}
        <div class="level-item" data-crown={crown}>
          <img src={icons.crowns[crown]} alt={crown} height="50px" />
          <span>
            {getSongRating(accuracy, crown, measureValue) / (perSong ? 50 : 1)}
          </span>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .level-text {
    margin: 0;
  }

  .level-button-containers {
    margin-top: 12px;
  }

  .level-button-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .level-button {
    background-color: black;
    color: white;
    border: none;
    transition: all 0.1s ease-in-out;
    width: 23px;
    height: 23px;
  }

  .level-button.active {
    background-color: #444;
  }

  .level-button:hover {
    background-color: #555;
  }

  .rating-value-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .level-item {
    display: flex;
    align-items: center;
    margin: 4px 24px;
    padding: 8px 36px;
    background-color: #0003;
    border-radius: 12px;
  }

  .level-item img {
    margin-right: 24px;
  }

  .level-item span {
    font-size: 1.5em;
    width: 100px;
  }

  .level-item[data-crown="donderfull"] {
    background: linear-gradient(45deg,#ffb3ba,#ffdfba,#ffffba,#baffc9,#bae1ff)
  }

  .level-item[data-crown="gold"] {
   background-color: #ffe972;
  }

  .level-item[data-crown="silver"] {
    background-color: #C0C0C0;
  }

  input[type="range"] {
    width: 100%;
  }
</style>
