<script lang="ts">
  import Song from '../Song/Song.svelte'
  import Lazy from 'svelte-lazy'

  import type { SongDB } from '../../lib/songDB'
  import type { GenreType, SongScore } from '../../types'
  import type { PlaylistsStore } from '../../lib/playlist'
  import type { SettingsStorage } from '../../lib/settings'
  import SongLazyInfo from './SongLazyInfo.svelte'
  import type { Analyzer } from '../../lib/analyzer'

  export let genre: GenreType | undefined
  export let songScores: SongScore[] = []
  export let settingsStorage: SettingsStorage
  export let songDB: SongDB
  export let analyzer: Analyzer
  export let taikoNo: string | undefined
  export let playlists: PlaylistsStore

  const getTitle = (parsedTitle: string, songNo: string): string => {
    const language = settingsStorage.language
    if (language === 'ko') {
      return songDB.getSongData(songNo)?.titleKo ?? parsedTitle
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
      {@const translatedTitle = getTitle(songScore.title, songScore.songNo)}
      <Lazy height={94} offset={1000} fadeOption={{ duration: 100 }} placeholder={SongLazyInfo} placeholderProps={{ str: songScore.title + translatedTitle }} >
        <Song
          songNo={songScore.songNo}
          title={songScore.title}
          translatedTitle={translatedTitle}
          songData={songDB.getSongData(songScore.songNo)}
          details={songScore.details}
          genre={genre}
          taikoNo={taikoNo}
          playlists={playlists}
          analyzer={analyzer}
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
