<script lang="ts">
  import { icons } from '../../assets'

  interface RatingDataWithScoreData {
    songNo: number
    difficulty: 'oni' | 'ura'
    songRating: {
      value: number
      accuracy: number
      measureValue: number
    }
    scoreData: {
      crown: 'played' | 'silver' | 'gold' | 'donderfull'
      badge: 'rainbow' | 'purple' | 'pink' | 'gold' | 'silver' | 'bronze' | 'white' | null
      score: number
      ranking: number
      good: number
      ok: number
      bad: number
      maxCombo: number
      roll: number
      count: {
        play: number
        clear: number
        fullcombo: number
        donderfullcombo: number
      }
    } | null
  }

  export let item: RatingDataWithScoreData
  export let link: string
  export let color: string
  export let i: number
  export let title: string
</script>

{#if item}
<a href={`${link}`} target="_blank">
  <div class="card" style={`background-color: ${color}`}>
    <span> {title} (#{i + 1}) </span>
    <div class="items">
      <span> {item.songRating.measureValue.toFixed(1)} </span>
      <span class="divider"> | </span>
      <span class="tooltip">
        {item.songRating.accuracy.toFixed(1)}%
      </span>
      <span class="divider"> | </span>
      <span class="tooltip">
        {item.songRating.value}
      </span>
      <span class="divider"> | </span>
      {#if item.scoreData}
        <img class="icon" src={icons.crowns[item.scoreData.crown]} alt={item.scoreData.crown}/>
      {/if}
    </div>
  </div>
</a>
{/if}

<style>
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
