<script lang="ts">
  import type { SearchOptions } from '../../types'
  import type { Writable } from 'svelte/store'

  export let searchOptions: Writable<SearchOptions>

  let text = ''

  const onSubmit = (ev: Event): void => {
    ev.preventDefault()
    searchOptions.update((options) => {
      options.text = text
      return options
    })
  }
</script>

<form class="search-text" on:submit={onSubmit}>
  <input
    id="song-search-input"
    type="text"
    placeholder="song title or artist"
    bind:value={text}
    on:blur={onSubmit}
  />
  <button type="submit">Search</button>
</form>

<style>
  .search-text {
    display: flex;
    font-size: 32px;
    justify-content: center;
    margin-bottom: 4px;
  }

  #song-search-input {
    flex-grow: 1;
  }

  button {
    box-shadow: none;
    border-radius: 0px;
  }
</style>
