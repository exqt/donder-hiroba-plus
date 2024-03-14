<script lang="ts">
  import type { SortOptions } from '../../types'
  import Header from './Header.svelte'
  import SearchSortItem from './SearchSortItem.svelte'
  import type { Writable } from 'svelte/store'

  export let sortOptions: Writable<SortOptions>

  const reset = (): void => {
    sortOptions.set({ key: '', inc: true })
  }
</script>

<div>
  <Header name="SORT" on:click={reset}/>
  <div class="sort-options">
    {#each ['easy', 'normal', 'hard', 'oni', 'ura', 'alphabet', 'length', 'bpm'] as key}
      <SearchSortItem
        {key}
        {sortOptions}
      />
    {/each}
  </div>
</div>

<style>
  .sort-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
