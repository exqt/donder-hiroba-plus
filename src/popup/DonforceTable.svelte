<script lang="ts">

  import Switch from '../components/Common/Switch.svelte'

  import { CROWNS, DONFORCE_NUMBER_OF_RECORDS } from '../constants'
  import { icons } from '../assets'
  import { calculateDonforce } from '../lib/donforce'
  import type { BadgeType } from '../types'

  let stars = 10
  let subStar = 0
  let perSong = false
  $: divider = perSong ? DONFORCE_NUMBER_OF_RECORDS : 1

  const crownsExceptNone = CROWNS.filter((crown) => crown !== 'none')
  const badgeList: BadgeType[] = [8, 7, 6, 5, 4, 3, 2]
</script>

<div class="wrapper">
  <div class="level-button-containers">
    <div class="level-button-container">
      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as i}
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

  <p class="level-text">Star: {(stars + subStar / 10).toFixed(1)}</p>

  <Switch bind:checked={perSong} label={` / ${DONFORCE_NUMBER_OF_RECORDS}`}/>

  <table>
    <thead>
      <tr>
        <th class="corner-cell"></th>
        <th class="crown-cell"> <img src={icons.crowns.silver} alt="silver"/> </th>
        <th class="crown-cell"> <img src={icons.crowns.gold} alt="gold"/> </th>
        <th class="crown-cell"> <img src={icons.crowns.donderfull} alt="donderfull"/> </th>
      </tr>
    </thead>
    <tbody>
      {#each badgeList as badge}
        <tr>
          <td class="badge-cell">
            <img src={icons.badges[badge]} alt={`badge-${badge}`}/>
          </td>
          {#each crownsExceptNone as crown}
            <td>
              {(calculateDonforce(badge, crown, stars + subStar / 10) / divider).toFixed(3)}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
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
    width: 25px;
    height: 25px;
  }

  .level-button.active {
    background-color: #444;
  }

  .level-button:hover {
    background-color: #555;
  }

  table {
    border-collapse: collapse;
  }

  thead {
    height: 50px;
  }

  th {
    height: 40px;
  }

  td, th {
    border: 1px solid black;
    text-align: center;
  }

  td {
    padding: 0px 4px;
  }

  .corner-cell {
    border: none;
  }

  .crown-cell > img {
    width: 44px;
    margin: 0px 8px;
  }

  .badge-cell > img {
    height: 40px;
  }
</style>
