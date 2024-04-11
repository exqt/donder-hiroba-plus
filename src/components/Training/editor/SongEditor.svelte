<script lang="ts">
  import { type SongDB } from '../../../lib/songDB'
  import type { GenreType, TrainingCourseSong } from '../../../types'
  import SongSelector from './SongSelector.svelte'
  import { icons } from '../../../assets'
  import ConditionEditor from './ConditionEditor.svelte'

  export let song: TrainingCourseSong
  export let removeSong: () => void
  export let songDB: SongDB

  let selecting = false

  const genreColor = {
    jpop: '#42c1d2',
    anime: '#ff90d3',
    kids: '#ffc000',
    vocaloid: '#cdcfe0',
    game: '#cc8aea',
    variety: '#1dc83b',
    classic: '#c9c100',
    namco: '#ff7028'
  }
  function gradient (
    genres: GenreType[]
  ): string {
    if (genres.length === 1) {
      if (genres[0] === 'unknown') {
        return ''
      }
      return genreColor[genres[0]]
    }
    return `linear-gradient(to left, ${genres
      .map((genre) => {
        if (genre === 'unknown') {
          return null
        }
        return genreColor[genre]
      })
      .filter((c) => c !== null)
      .map(
        (color, i, a) =>
          `${color} calc(100% / ${a.length} * ${i}) calc(100% / ${a.length} * ${i + 1})`
      )
      .join(',')})`
  }

  function addCondition (): void {
    song.conditions.push({
      type: 'good',
      criterion: 1
    })
    song.conditions = song.conditions
  }
  function removeCondition (index: number): void {
    song.conditions = song.conditions.filter((_, i) => i !== index)
  }
</script>

<div class="container">
  <div class="r">
    <button class="remove" on:click={removeSong}>X</button>
  </div>
  <button
    on:click={() => {
      selecting = !selecting
    }}
    class="title"
    style={`background:${gradient(songDB.getSongData(song.songNo.toString())?.genres ?? ['unknown'])};`}
  >
    {#if song.songNo === 0}
      +
    {:else}
      {songDB.getSongData(song.songNo.toString())?.title}
    {/if}
  </button>
  {#if song.songNo !== 0}
    <div class="difficulty">
      <label>
        <input type="radio" bind:group={song.difficulty} value="easy" />
        <img src={icons.kantan} alt="" />
      </label>
      <label>
        <input type="radio" bind:group={song.difficulty} value="normal" />
        <img src={icons.futsuu} alt="" />
      </label>
      <label>
        <input type="radio" bind:group={song.difficulty} value="hard" />
        <img src={icons.muzukashii} alt="" />
      </label>
      <label>
        <input type="radio" bind:group={song.difficulty} value="oni" />
        <img src={icons.oni} alt="" />
      </label>
      {#if songDB.getSongData(song.songNo.toString())?.levels.oni_ura !== 0}
        <label>
          <input type="radio" bind:group={song.difficulty} value="oni_ura" />
          <img src={icons.ura} alt="" />
        </label>
      {/if}
    </div>
  {/if}
  <SongSelector bind:selecting bind:songNo={song.songNo} {gradient} {songDB} />
  <div class="condition">
    <span>
      조건
      <button on:click={addCondition}>+</button>
    </span>
    {#each song.conditions as condition, index}
      <ConditionEditor
        bind:condition
        removeCondition={() => {
          removeCondition(index)
        }}
      />
    {/each}
  </div>
</div>

<style>
  .container {
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;

    box-sizing: border-box;
    border: 2px solid white;
    border-radius: 10px;

    background-color: #ffcc00;

    padding-top: 2px;
    padding-bottom: 2px;

    position: relative;

    overflow: hidden;
  }
  .r {
    width: 265px;
    display: flex;
    justify-content: flex-end;
  }
  .remove {
    width: 30px;
    height: 16px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    width: 265px;
    min-height: 42px;
    color: white;
    font-weight: bold;
    text-shadow:
      -2px -2px 2px rgba(142, 142, 142, 0.606),
      2px -2px 2px rgba(142, 142, 142, 0.606),
      -2px 2px 2px rgba(142, 142, 142, 0.606),
      2px 2px 2px rgba(142, 142, 142, 0.606);
  }
  .difficulty {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
  .difficulty > label {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .difficulty img {
    width: 30px;
    height: 30px;
  }
  .condition {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
