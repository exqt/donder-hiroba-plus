<script lang="ts">
  import type { DifficultyType, SongScoreDetail } from '../../types'
  import { icons } from '../../assets'
  import { DIFFICULTY_COLORS } from '../../constants'
  import { getSongDetailLink } from '../../lib/songs'

  export let songNo: string
  export let difficulty: DifficultyType
  export let detail: SongScoreDetail
  export let level: number | undefined
  export let i: number

  const link = getSongDetailLink(songNo, difficulty)
</script>

<a draggable="false" href={link}>
  <div class="difficulty" style="background-color: {DIFFICULTY_COLORS[i]}">
    {#if level}
      <span class="stars">★{i >= 3 ? level.toFixed(1) : level}</span>
    {/if}
    <div class="score-detail">
      <img class:invisible={detail.crown === 'none'} src={icons.crowns[detail.crown]} alt="crown" height="20" draggable="false" />
      <img class:invisible={detail.badge === 1} src={icons.badges[detail.badge]} alt="badge" height="22" draggable="false" />
    </div>
  </div>
</a>

<style>
  a {
    color: white !important;
    text-decoration: none !important;
  }

  .difficulty {
    min-width: 46px;
    min-height: 22px;
    height: 100%;
    padding: 1px;
    text-align: center;
    border-radius: 4px;
    margin: 0 1px;
    user-select: none;
    transition: all 0.1s ease-in-out;
  }

  .difficulty:hover {
    filter: brightness(0.8);
  }

  .stars {
    font-size: 12px;
  }

  .score-detail {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .invisible {
    visibility: hidden;
  }
</style>
