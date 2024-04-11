<script lang="ts">
  import { icons } from '../../../assets'
  import type { ScoreStorage } from '../../../lib/scores'
  import type { SongDB } from '../../../lib/songDB'
  import type { DifficultyType, TrainingCourseSong } from '../../../types'
  import Condition from './Condition.svelte'

  export let song: TrainingCourseSong
  export let songDB: SongDB
  export let scoreStorage: ScoreStorage
  export let addAchieve: () => void

  let achievedConditions = 0
  $: if (achievedConditions === song.conditions.length) {
    addAchieve()
  }
  function addAchievedCondition (): void {
    achievedConditions++
  }

  const score = scoreStorage.getScoreByNo(song.songNo.toString())?.details[
    song.difficulty
  ]

  function getDifficulty (
    difficulty: DifficultyType
  ): string {
    switch (difficulty) {
      case 'easy': {
        return icons.kantan
      }
      case 'normal': {
        return icons.futsuu
      }
      case 'hard': {
        return icons.muzukashii
      }
      case 'oni': {
        return icons.oni
      }
      case 'oni_ura': {
        return icons.ura
      }
    }
  }
</script>

<div class="song">
  <h1 class="title">
    <img src={getDifficulty(song.difficulty)} alt="" />
    <div>{songDB.getSongData(song.songNo.toString())?.title}</div>
  </h1>
  {#each song.conditions as condition}
    <Condition {condition} {score} {addAchievedCondition} />
  {/each}
</div>

<style>
  .song {
    width: 265px;

    border-radius: 10px;
    background-color: #ff7f00;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title {
    color: white;
    font-weight: bold;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
    padding-top: 2px;
    padding-right: 20px;
  }

  .title div {
    text-align: center;
    word-break: break-all;
  }

  .title img {
    width: 30px;
    height: 30px;

    transform: translateY(-2px);
    vertical-align: middle;
  }
</style>
