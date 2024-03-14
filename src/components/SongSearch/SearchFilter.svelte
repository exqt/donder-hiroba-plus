<script lang="ts">
  import { BADGES, CROWNS } from '../../constants'
  import { icons } from '../../assets'
  import type { Writable } from 'svelte/store'
  import type { BadgeType, CrownType, SearchOptions } from '../../types'
  import Header from './Header.svelte'

  export let crownCounts: Record<CrownType, number>
  export let badgeCounts: Record<BadgeType, number>
  export let searchOptions: Writable<SearchOptions>

  $: crownOptions = $searchOptions.crown
  $: badgeOptions = $searchOptions.badge

  const onClickCrownHeader = (): void => {
    const allChecked = Object.values(crownOptions).every((v) => v)
    for (const key of CROWNS) {
      crownOptions[key] = !allChecked
    }
    searchOptions.update((options) => {
      options.crown = crownOptions
      return options
    })
  }

  const onClickBadgeHeader = (): void => {
    const allChecked = Object.values(badgeOptions).every((v) => v)
    for (const key of BADGES) {
      badgeOptions[key] = !allChecked
    }
    searchOptions.update((options) => {
      options.badge = badgeOptions
      return options
    })
  }

  const onClickBadge = (badge: BadgeType): void => {
    badgeOptions[badge] = !badgeOptions[badge]
    searchOptions.update((options) => {
      options.badge = badgeOptions
      return options
    })
  }

  const onClickCrown = (crown: CrownType): void => {
    crownOptions[crown] = !crownOptions[crown]
    searchOptions.update((options) => {
      options.crown = crownOptions
      return options
    })
  }

  const badgeList = BADGES.toReversed()

  const crownIcons: Record<string, string> = {
    none: icons.crowns.none,
    silver: icons.crowns.silver,
    gold: icons.crowns.gold,
    donderfull: icons.crowns.donderfull
  }

  const badgeIcons: Record<number, string> = icons.badges

</script>

<div class="wrapper">
  <Header name="CROWN" on:click={onClickCrownHeader}/>
  <div class="items">
    {#each CROWNS as crown}
      <div class="item" class:unchecked={!crownOptions[crown]}>
        <input
          class="checkbox"
          type="checkbox"
          id={`crown-${crown}-filter`}
          name={`crown-${crown}`}
          checked={crownOptions[crown]}
          on:click={() => { onClickCrown(crown) }}
          style="display: none;"
        >
        <label for={`crown-${crown}-filter`}>
          <img class="icon" src={crownIcons[crown]} alt={`crown-${crown}`}/>
          <span class="item-counts">{crownCounts[crown]}</span>
        </label>
      </div>
    {/each}
  </div>

  <Header name="BADGE" on:click={onClickBadgeHeader}/>
  <div class="items">
    {#each badgeList.slice(0, 8) as badge}
      <div class="item" class:unchecked={!badgeOptions[badge]}>
        <input
          class="checkbox"
          type="checkbox"
          id={`badge-${badge}-filter`}
          name={`badge-${badge}`}
          checked={badgeOptions[badge]}
          on:click={() => { onClickBadge(badge) }}
          style="display: none;"
        >
        <label for={`badge-${badge}-filter`}>
          <img class="icon" src={badgeIcons[badge]} alt={`badge-${badge}`}/>
          <span class="item-counts">{badgeCounts[badge]}</span>
        </label>
      </div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 4px 0px;
  }

  .item {
    margin: 0px 6px;
  }

  .item:hover {
    filter: brightness(1.2);
  }

  .item-counts {
    font-size: 12px;
    width: 16px;
  }

  .icon {
    margin: 0px 4px;
    width: 32px;
  }

  .item > label {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }

  .unchecked {
    filter: opacity(0.3);
  }

  .unchecked:hover {
    filter: opacity(0.5);
  }
</style>
