<script lang="ts">
  import Song from '../Song/Song.svelte'
  import Lazy from 'svelte-lazy'

  import type { SongDB } from '../../lib/songDB'
  import type { GenreType, SongScore } from '../../types'
  import type { PlaylistsStore } from '../../lib/playlist'
  import type { SettingsStorage } from '../../lib/settings'

  export let genre: GenreType | undefined
  export let songScores: SongScore[] = []
  export let settingsStorage: SettingsStorage
  export let songDB: SongDB
  export let taikoNo: string | undefined
  export let playlists: PlaylistsStore

  const getTitle = (parsedTitle: string, songNo: string): string => {
    const language = settingsStorage.language
    if (language === 'ko') {
      return songDB.getSongData(songNo)?.title_kr_user ?? parsedTitle
    }

    return parsedTitle
  }
</script>

<div>
  <span class="song-count">
    {#if songScores.length === 1}
      1 song found.
    {:else if songScores.length === 0}
      No songs found.
    {:else}
      {songScores.length} songs found.
    {/if}
  </span>
  <div class="song-container">
    {#each songScores as songScore (songScore.songNo)}
      <Lazy height={94} offset={1000} fadeOption={{ duration: 100 }}>
        <Song
          songNo={songScore.songNo}
          title={songScore.title}
          translatedTitle={getTitle(songScore.title, songScore.songNo)}
          songData={songDB.getSongData(songScore.songNo)}
          details={songScore.details}
          genre={genre}
          taikoNo={taikoNo}
          playlists={playlists}
        />
      </Lazy>
    {/each}
  </div>
</div>

<style>
  .song-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
  }

  .song-count {
    font-size: 16px;
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
  }
</style>
