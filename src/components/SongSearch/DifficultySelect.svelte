<script lang="ts">
  import { DIFFICULTIES, DIFFICULTY_COLORS } from '../../constants'
  import type { Writable } from 'svelte/store'
  import type { DifficultyType } from '../../types'
  import { icons } from '../../assets'
  import Header from './Header.svelte'

  export let searchDifficulties: Writable<Record<DifficultyType, boolean>>

  const iconMap: Record<string, string> = {
    easy: icons.kantan,
    normal: icons.futsuu,
    hard: icons.muzukashii,
    oni: icons.oni,
    oni_ura: icons.ura
  }

  const onClick = (diff: DifficultyType): void => {
    searchDifficulties.update((diffs) => {
      diffs[diff] = !diffs[diff]
      return diffs
    })
  }

  const reset = (): void => {
    const allChecked = Object.values($searchDifficulties).every((v) => v)

    searchDifficulties.update((diffs) => {
      for (const diff of DIFFICULTIES) {
        diffs[diff] = !allChecked
      }
      return diffs
    })
  }
</script>

<div class="wrapper">
  <Header name="DIFFICULTY" on:click={reset}/>
  <div class="difficulty-select">
    {#each DIFFICULTIES as diff, i}
      <button
        class="difficulty"
        class:selected={$searchDifficulties[diff]}
        style={`background-color: ${DIFFICULTY_COLORS[i]}`}
        on:click={() => { onClick(diff) }}
      >
        <img class="icon" src={iconMap[diff]} alt={diff} />
      </button>
    {/each}
  </div>
</div>

<style>
  .difficulty-select {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .icon {
    width: 32px;
    height: 32px;
  }

  .difficulty {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 2px;
    border-radius: 4px;
    box-shadow: none;
    border: none;
    color: white;
  }

  .difficulty:not(.selected) {
    filter: saturate(0.0) brightness(0.5)
  }
</style>
