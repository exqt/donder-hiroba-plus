<script lang="ts">
    import { DIFFICULTY_TO_INDEX } from '../../constants';
  import type { PlaylistsStore } from '../../lib/playlist'
    import type { DifficultyType } from '../../types';
    import Song from '../Song/Song.svelte';

  export let songNo: string
  export let difficulty: DifficultyType = 'oni'
  export let playlists: PlaylistsStore
  export let x: number
  export let y: number

  const onClickItem = async (idx: number): Promise<void> => {
    const playlist = $playlists[idx]
    await playlists.addOrRemoveSong(playlist, songNo)
  }

  const createNewPlaylist = async (): Promise<void> => {
    const title = prompt('Enter the title of the playlist')
    if (title === null) return

    await playlists.add({
      uuid: Math.random().toString(36).slice(-8),
      title,
      songNoList: [songNo]
    })
  }

  const wikiLink = `https://taiko.wiki/song/${songNo}`
  const hirobaLink = `https://donderhiroba.jp/score_detail.php?song_no=${songNo}&level=${DIFFICULTY_TO_INDEX[difficulty]+1}`
</script>

<div class="context-menu" style="top: {y}px; left: {x}px">
  <div class="playlist-action">
    <div class="item-container">
      <a href={wikiLink} target="_blank" rel="noreferrer">
        <button class="item">
          <span>🔗</span>
          <span>Open in New Tab</span>
        </button>
      </a>
      <a href={hirobaLink} target="_blank" rel="noopener noreferrer">
        <button class="item">
          <span>🔗</span>
          <span>Score on Donder Hiroba</span>
        </button>
      </a>
    </div>
    <div class="item-container">
      {#each $playlists as item, i}
        <button class="item" on:click={async () => { await onClickItem(i) }}>
          <span class:invisible={!item.songNoList.includes(songNo)}>✔️</span>
          <span>{item.title}</span>
          <span class="song-count" style="margin-left: 8px">({item.songNoList.length}/30)</span>
        </button>
      {/each}
      <button class="item" on:click={createNewPlaylist}>
        <span>➕</span>
        <span>Create New Playlist</span>
      </button>
    </div>
  </div>

</div>

<style>
  .context-menu {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 1em;
    border-radius: 4px;
    font-weight: 500;
    z-index: 10000;
  }

  .playlist-action {
    position: static;
    min-width: 200px;
    top: 26px;
    left: 0;
    border-radius: 5px;
    padding: 5px;
    z-index: 1000;
    background-color: #333;
    color: white;
    filter: drop-shadow(4px 4px 4px #0005);
  }

  .item-container {
    display: flex;
    flex-direction: column;
  }

  .item-container:not(:last-child) {
    border-bottom: 4px solid #0002;
  }

  .invisible {
    visibility: hidden;
  }

  .item {
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    box-shadow: none;
    text-align: left;
    color: white;
    width: 100%;
  }

  .item:hover {
    background-color: #0003;
  }

  .item:not(:last-child) {
    border-bottom: 1px solid #0002;
  }

  .song-count {
    margin-left: auto;
    text-align: right;
    float: right;
  }

  @media (prefers-color-scheme: light) {
    .context-menu {
      background-color: #f1f1f1;
      color: black;
    }

    .item {
      color: black;
    }

    .item:hover {
      background-color: #0003;
    }

    .playlist-action {
      background-color: #f1f1f1;
      color: black;
    }

    .playlist-action:after {
      background-color: rgba(0,0,0,0.2);
    }

    .song-count {
      color: black;
    }
  }
</style>
