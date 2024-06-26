<script lang="ts">
  // import { dndzone } from 'svelte-dnd-action'
  import type { SongDB } from '../../lib/songDB'
  import type { FavoriteSong, Language } from '../../types'
  import Song from '../Song/Song.svelte'
  import { flip } from 'svelte/animate'
  import type { ScoreStorage } from '../../lib/scores'
  import { getTranslatedTitle } from '../../lib/songs'
  import type { PlaylistsStore } from '../../lib/playlist'
  import Button from '../Common/Button.svelte'
  import type { Analyzer } from '../../lib/analyzer'

  export let songDB: SongDB | undefined
  export let analyzer: Analyzer
  export let favoriteSongList: FavoriteSong[]
  export let scoreStorage: ScoreStorage | undefined
  export let language: Language
  export let playlists: PlaylistsStore
  // export let onChange: (favoriteSongs: FavoriteSong[]) => void

  $: items = favoriteSongList.map((song, index) => ({ id: song.songNo, song, originalIndex: index }))

  const flipDurationMs = 300

  /*
  const handleDndConsider = (e: CustomEvent): void => {
    items = e.detail.items
  }
  const handleDndFinalize = (e: CustomEvent): void => {
    items = e.detail.items
    onChange(items.map((item) => item.song))
  }
  */

  const deleteItem = (originalIndex: number): void => {
    const deleteButtons = document.querySelectorAll('.buttonDeleteSong')
    const elem = deleteButtons[originalIndex] as HTMLElement
    if (elem === undefined) return
    elem.querySelector('img')?.click()
  }

  const changeItem = (originalIndex: number): void => {
    const changeButtons = document.querySelectorAll('.buttonSelectSong')
    const elem = changeButtons[originalIndex] as HTMLElement
    if (elem === undefined) return
    elem.querySelector('img')?.click()
  }

  const addSong = (): void => {
    const nextIdx = items.length + 1
    const addSongButton = document.querySelector(`.songSelectButton${nextIdx}`)
    if (addSongButton === null) return
    (addSongButton as HTMLElement).click()
  }
</script>

<div class="wrapper">
  {#if songDB !== undefined && scoreStorage !== undefined}
  <section class="song-container"> <!--use:dndzone={{ type: 'fav-song', items, flipDurationMs }} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>-->
    {#each items as item, idx (item.id)}
      {@const song = item.song}
      {@const genre = song.genre}
      {@const title = song.title}
      {@const songData = songDB.getSongData(song.songNo)}
      {@const scores = scoreStorage.getScoreByNo(song.songNo)}
      <div animate:flip={{ duration: flipDurationMs }}>
        <div class="song-wrapper">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="song-numbering">#{idx + 1}</span>
            <div>
              <button on:click={() => { changeItem(item.originalIndex) }}>Change</button>
              <button on:click={() => { deleteItem(item.originalIndex) }}>❌</button>
            </div>
          </div>
          <Song
            songNo={song.songNo}
            title={title}
            genre={genre}
            details={scores?.details ?? {}}
            translatedTitle={getTranslatedTitle(songData, scores, language)}
            songData={songData}
            taikoNo={''}
            playlists={playlists}
            analyzer={analyzer}
          />
        </div>
      </div>
  {/each}
  {#if items.length < 30}
    <Button on:click={addSong}>+ Add Song</Button>
  {/if}
  </section>
  {/if}
</div>

<style>
  .song-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 16px 0;
    padding-bottom: 24px;
  }

  .song-wrapper {
    border-radius: 4px;
  }

  button {
    box-shadow: none;
    border-radius: 2px;
    border: 1px solid #000;
    background-color: #fff;
  }

  .song-numbering {
    font-size: 1.2em;
    font-weight: bold;
    color: white;
    background-color: #0004;
    border-radius: 4px;
    padding: 2px 4px;
  }
</style>
