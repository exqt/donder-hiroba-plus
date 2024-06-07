<script lang="ts">
  import { type Analyzer } from '../../lib/analyzer'
  import { DIFFICULTIES } from '../../constants'
  import type { DifficultyType, GenreType, SongData, SongScoreDetail } from '../../types'
  import DifficultyLink from './DifficultyLink.svelte'
  import SongInfo from './SongInfo.svelte'
  import { icons } from '../../assets'
  import type { PlaylistsStore } from '../../lib/playlist'
  import { onDestroy, onMount } from 'svelte'
  import PlaylistContextMenu from '../Common/PlaylistContextMenu.svelte'

  export let songNo: string
  export let title: string
  export let translatedTitle: string | undefined
  export let genre: GenreType | undefined
  export let songData: SongData | undefined
  export let details: Partial<Record<DifficultyType, SongScoreDetail>>
  export let taikoNo: string | undefined
  export let playlists: PlaylistsStore | undefined
  export let analyzer: Analyzer

  let showInfo = false
  let showPlaylistAction = false

  const hasUra = details?.oni_ura !== undefined

  const onClickPlaylist = (e: MouseEvent): void => {
    showPlaylistAction = !showPlaylistAction
  }

  const onClickInfo = (e: MouseEvent): void => {
    showInfo = !showInfo
  }

  const levels: Record<DifficultyType, number> = {
    easy: 0,
    normal: 0,
    hard: 0,
    oni: 0,
    oni_ura: 0
  }

  let wrapper: HTMLDivElement
  const hideShowPlaylist = (ev: MouseEvent): void => {
    if (!showPlaylistAction) return

    const target = ev.target as HTMLElement

    if (wrapper.contains(target)) return
    showPlaylistAction = false
  }

  onMount(async () => {
    levels.easy = analyzer.getLevelWidthSub(songNo, 'easy')
    levels.normal = analyzer.getLevelWidthSub(songNo, 'normal')
    levels.hard = analyzer.getLevelWidthSub(songNo, 'hard')
    levels.oni = analyzer.getLevelWidthSub(songNo, 'oni')
    levels.oni_ura = analyzer.getLevelWidthSub(songNo, 'oni_ura')

    document.body.addEventListener('click', hideShowPlaylist)
    document.body.addEventListener('contextmenu', hideShowPlaylist)
  })

  onDestroy(() => {
    document.body.removeEventListener('click', hideShowPlaylist)
    document.body.removeEventListener('contextmenu', hideShowPlaylist)
  })
</script>

<div class={`song-wrapper ${genre}`} bind:this={wrapper}>
  {#if songData}
  <button class="info-toggle" on:click={onClickInfo}>
    <img class="toggle-icon" src={icons.informationCircle} alt="info-toggle"/>
  </button>
  {/if}

  {#if playlists}
    <button class="playlist-toggle" on:click={onClickPlaylist}>
      <img class="toggle-icon" src={icons.list} alt="info-toggle"/>
    </button>
  {/if}

  <span class="title">{translatedTitle ?? title}</span>
  {#if translatedTitle !== title && title !== undefined}
    <span class="title">{title}</span>
  {/if}

  {#if showPlaylistAction && playlists}
    <PlaylistContextMenu
      {songNo}
      {playlists}
      x={0}
      y={0}
    />
  {/if}

  {#if showInfo}
    <SongInfo {title} {songNo} {songData} />
  {/if}

  <div class="difficulties">
    {#each DIFFICULTIES.slice(0, hasUra ? 5 : 4) as difficulty, i}
      {@const detail = details[difficulty]}
      {@const level = levels[difficulty]}
      {#if detail}
        <DifficultyLink {songNo} {difficulty} {level} {i} {detail} {taikoNo} />
      {/if}
    {/each}
  </div>
</div>

<style>
  .song-wrapper {
    position: relative;
    width: 256px;
    padding: 10px 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: white;
    background-color: #21A1BA;
    border: 2px solid rgba(152,211,222,0.5);
    box-shadow: 3px 2px 2px 2px #0C6473, -3px -2px 2px 2px #7DC5D4;
  }

  .song-wrapper.jpop {
    background-color: #21A1BA;
    border: 2px solid rgba(152,211,222,0.5);
    box-shadow: 3px 2px 2px 2px #0C6473, -3px -2px 2px 2px #7DC5D4;
  }

  .song-wrapper.kids {
    background-color: #FF9900;
    border: 2px solid rgba(255,221,159,0.5);
    box-shadow: 3px 2px 2px 2px #E65300, -3px -2px 2px 2px #FFDA8F;
  }

  .song-wrapper.classic {
    background-color: #D1A314;
    border: 2px solid rgba(236,215,139,0.5);
    box-shadow: 3px 2px 2px 2px #996900, -3px -2px 2px 2px #E8CF6B;
  }

  .song-wrapper.variety {
    background-color: rgb(106, 153, 31);
    border: 2px solid rgba(220,234,176,0.5);
    box-shadow: 3px 2px 2px 2px #5A7A0B, -3px -2px 2px 2px #CEE191;
  }

  .song-wrapper.anime {
    background-color: #FF5386;
    border: 2px solid rgba(255,191,209,0.5);
    box-shadow: 3px 2px 2px 2px #BA1057, -3px -2px 2px 2px #FFB8CC;
  }

  .song-wrapper.game {
    background-color: #9D76BF;
    border: 2px solid rgba(205,184,218,0.5);
    box-shadow: 3px 2px 2px 2px #603E7E, -3px -2px 2px 2px #BEA3CC;
  }

  .song-wrapper.namco {
    background-color: #FF5B14;
    border: 2px solid rgba(255,190,151,0.5);
    box-shadow: 3px 2px 2px 2px #B22F00, -3px -2px 2px 2px #FFA46D;
  }

  .song-wrapper.vocaloid {
    background-color: #ABB4BF;
    border: 2px solid rgba(209,218,230,0.5);
    box-shadow: 3px 2px 2px 2px #6B7B8E, -3px -2px 2px 2px #EEEEEE;
  }

  .title {
    margin-bottom: 4px;
    font-weight: bold;
    text-shadow: 2px 2px 2px #0005;
    text-wrap: balance;
    text-align: center;
  }

  .difficulties {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    margin: 0 4px;
    z-index: 999;
  }

  button {
    background-color: #0004;
    filter: invert(0.9);
    border: none;
    border-radius: 4px;
    box-shadow: none;
    margin: 0;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info-toggle {
    position: absolute;
    top: 2px;
    right: 2px;
  }

  .playlist-toggle {
    position: absolute;
    top: 2px;
    left: 2px;
  }

  .toggle-icon {
    width: 24px;
  }
</style>
