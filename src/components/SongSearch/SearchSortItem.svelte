<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { icons } from '../../assets'
  import type { SortOptions } from '../../types'

  export let key: string
  export let sortOptions: Writable<SortOptions>

  const iconMap: Record<string, string> = {
    easy: icons.kantan,
    normal: icons.futsuu,
    hard: icons.muzukashii,
    oni: icons.oni,
    ura: icons.ura,
    bpm: icons.quarterNote,
    length: icons.hourglass,
    alphabet: icons.alphabet
  }

  const icon = iconMap[key]

  const onInc = (): void => {
    sortOptions.set({ key, inc: true })
  }

  const onDec = (): void => {
    sortOptions.set({ key, inc: false })
  }
</script>

<div class="search-sort">
  <img class="icon" src={(icon)} alt={key} />
  <div class="button-group">
    <button class="button" on:click={onInc} class:selected={$sortOptions.key === key && $sortOptions.inc}>
      <img class="down-arrow" src={icons.arrow} alt="down"/>
    </button>
    <button class="button" on:click={onDec} class:selected={$sortOptions.key === key && !$sortOptions.inc}>
      <img class="up-arrow" src={icons.arrow} alt="up"/>
    </button>
  </div>
</div>

<style>
  .search-sort {
    font-size: 18px;
    display: inline-flex;
    background-color: #00000055;
    padding: 4px;
    margin: 2px;
    user-select: none;
    border-radius: 4px;
  }

  .up-arrow {
    transform: rotate(270deg);
  }

  .down-arrow {
    transform: rotate(90deg);
  }

  .button-group {
    display: flex;
  }

  .button {
    background-color: #00000055;
    width: 24px;
    height: 24px;
    padding: 4px;
    font-weight: 900;
    border: none;
    transition: all 0.2s ease-in-out;
    box-shadow: none;
  }

  .button:hover {
    background-color: #00000088;
  }

  .button.selected {
    background-color: #fffa;
  }

  .button:first-child {
    border-radius: 4px 0 0 4px;
  }

  .button:last-child {
    border-radius: 0 4px 4px 0;
  }

  .icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
</style>
