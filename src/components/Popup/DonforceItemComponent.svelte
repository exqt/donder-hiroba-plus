<script lang="ts">
  import type { DonforceItem, SongData, SongScoreDetail } from '../../types'
  import { icons } from '../../assets'

  export let item: DonforceItem
  export let i: number
  export let songData: SongData | undefined
  export let detail: SongScoreDetail | undefined
  export let level: number
  export let link: string
  export let color: string
</script>

{#if detail}
<a href={`${link}`} target="_blank">
  <div class="card" style={`background-color: ${color}`}>
    <span> {item.title} (#{i + 1}) </span>
    <div class="items">
      {#if songData?.courses[item.difficulty]}
        <span> ★ {level.toFixed(1)} </span>
        <span class="divider"> | </span>
        <span class="tooltip">
          💪 {item.donforce.toFixed(3)}
        </span>
        <span class="divider"> | </span>
      {/if}
      <img class="icon" src={icons.badges[detail.badge]} alt={'badge-' + detail.badge}/>
      <img class="icon" src={icons.crowns[detail.crown]} alt={detail.crown}/>
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
