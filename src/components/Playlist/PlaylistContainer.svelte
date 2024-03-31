<script lang="ts">
  import PlaylistComponent from './PlaylistComponent.svelte'
  import { flip } from 'svelte/animate'
  import { dndzone, type DndEvent } from 'svelte-dnd-action'
  import type { Playlist } from '../../types'
  import type { PlaylistsStore } from '../../lib/playlist'
  import type { SongDB } from '../../lib/songDB'
  import type { ExtensionStorage } from '../../lib/storage'

  export let playlists: PlaylistsStore
  export let songDB: SongDB
  export let storage: ExtensionStorage

  $: items = $playlists.map((playlist) => ({ id: playlist.uuid, playlist }))

  let container: HTMLElement

  const flipDurationMs = 300
  const handleDndConsider = async (e: CustomEvent<DndEvent>): Promise<void> => {
    console.log('consider', e.detail)
    items = e.detail.items as Array<{ id: string, playlist: Playlist }>
  }

  const handleDndFinalize = async (e: CustomEvent): Promise<void> => {
    items = e.detail.items
    await playlists.set(items.map((item) => item.playlist))
  }

  const onChange = async (playlist: Playlist): Promise<void> => {
    const t = $playlists
    const index = t.findIndex((item) => item.uuid === playlist.uuid)
    t[index] = playlist
    await playlists.set(t)
  }
</script>

{#if items.length === 0}
  <span>There's no playlist</span>
{/if}
<section bind:this={container} class="playlist-container" use:dndzone={{ type: 'playlist', items, flipDurationMs }} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
  {#each items as item(item.id)}
    <div animate:flip={{ duration: flipDurationMs }}>
      <PlaylistComponent
        playlistsStore={playlists}
        playlist={item.playlist}
        {songDB}
        {storage}
        onRemove={async () => { await playlists.remove(item.playlist) }}
        onChange={onChange}
      />
    </div>
  {/each}
</section>

<style>
  .playlist-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px 0;
  }
</style>
