<script lang="ts">
  import PlaylistComponent from './PlaylistComponent.svelte'
  import { flip } from 'svelte/animate'
  import { dndzone, type DndEvent } from 'svelte-dnd-action'
  import type { Playlist } from '../../types'
  import type { PlaylistsStore } from '../../lib/playlist'
  import type { SongDB } from '../../lib/songDB'

  export let playlists: PlaylistsStore
  export let songDB: SongDB

  const exportCurrentAsPlaylist = (playlist: Playlist): void => {
  }

  $: items = $playlists.map((playlist) => ({ id: `playlist-${playlist.title}`, playlist }))

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
        playlist={item.playlist}
        {songDB}
        onExport={() => { exportCurrentAsPlaylist(item.playlist) }}
        onRemove={async () => { await playlists.remove(item.playlist) }}
        onChange={onChange}
      />
    </div>
  {/each}
</section>
