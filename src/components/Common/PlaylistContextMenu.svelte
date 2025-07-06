<script lang="ts">
  import { onMount } from 'svelte';
  import { DIFFICULTY_TO_INDEX } from '../../constants'
  import type { PlaylistsStore } from '../../lib/playlist'
  import type RecentScoreStorage from '../Rating/recentScoreStorage'
    import type { DifficultyScoreData, ScoreData } from 'node-hiroba/types';
    import type { Difficulty } from '../Rating/ratingTypes';
  import { icons } from '../../assets'

  export let songNo: string
  export let difficulty: Difficulty = 'oni'
  export let playlists: PlaylistsStore
  export let recentScores: RecentScoreStorage
  export let x: number
  export let y: number
  export let wikiLink: string | undefined

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

  wikiLink ??= `https://taiko.wiki/song/${songNo}?diff=${difficulty}`
  const hirobaLink = `https://donderhiroba.jp/score_detail.php?song_no=${songNo}&level=${DIFFICULTY_TO_INDEX[difficulty] + 1}`
  const isWiki = window?.location?.hostname === 'taiko.wiki'
  let score: DifficultyScoreData | null = null

  onMount(() => {
    let recentScoreData = recentScores.getSongScoreData(songNo);
    if (recentScoreData !== null) {
      let _score = recentScoreData.difficulty[difficulty];
      if (_score !== null || _score === undefined) {
        score = _score as DifficultyScoreData;
      } else {
        score = null;
      }
    }
  })

  // score-detail 접기 상태
  import { writable } from 'svelte/store'
  const SCORE_DETAIL_COLLAPSE_KEY = 'scoreDetailCollapsed'
  function getInitialCollapsed() {
    if (typeof window === 'undefined') return false
    const v = window.localStorage.getItem(SCORE_DETAIL_COLLAPSE_KEY)
    return v === 'true'
  }
  const scoreDetailCollapsedStore = writable(getInitialCollapsed())
  scoreDetailCollapsedStore.subscribe(v => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SCORE_DETAIL_COLLAPSE_KEY, v ? 'true' : 'false')
    }
  })

  const onClickScoreDetailToggle = (e: MouseEvent) => {
    e.stopPropagation()
    scoreDetailCollapsedStore.update(v => !v)
  }
</script>

<div class="context-menu" style="top: {y}px; left: {x}px">
  <div class="playlist-action">
    {#if isWiki}
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
      {#if score}
      <div class="score-details">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="score-detail-header" on:click={onClickScoreDetailToggle}>
          <span class="score-detail-toggle">
            {#if $scoreDetailCollapsedStore}
              ▼
            {:else}
              ▲
            {/if}
          </span>
          <span>Score Details</span>
        </div>
        {#if !$scoreDetailCollapsedStore}
        <div>
          <div class="score-item score-total">
            <span>{score.score}点</span>
          </div>
          <div class="score-grid">
            <div class="score-item"><span style="color: orange">良</span><span>{score.good}</span></div>
            <div class="score-item"><span style="color: orange">最大コンボ</span><span>{score.maxCombo}</span></div>
            <div class="score-item"><span style="color: gray">可</span><span>{score.ok}</span></div>
            <div class="score-item"><span style="color: orange">連打数</span><span>{score.roll}</span></div>
            <div class="score-item"><span style="color: blue">不可</span><span>{score.bad}</span></div>
            <div class="score-item"></div>
            <div class="score-item">
              <img src={icons.crowns.played} alt="played" class="crown-icon" title="플레이 횟수" />
              <span>{score.count.play}</span>
            </div>
            <div class="score-item">
              <img src={icons.crowns.silver} alt="clear" class="crown-icon" title="클리어 횟수" />
              <span>{score.count.clear}</span>
            </div>
            <div class="score-item">
              <img src={icons.crowns.gold} alt="fullcombo" class="crown-icon" title="풀콤보" />
              <span>{score.count.fullcombo}</span>
            </div>
            <div class="score-item">
              <img src={icons.crowns.donderfull} alt="donderfullcombo" class="crown-icon" title="돈다풀콤보" />
              <span>{score.count.donderfullcombo}</span>
            </div>
          </div>
        </div>
        {/if}
      </div>
      {/if}
    </div>
    {/if}
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

  .score-details {
    padding: 5px;
    border-top: 1px solid #0002;
    border-bottom: 1px solid #0002;
  }

  .score-detail-header {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .score-detail-toggle {
    font-size: 12px;
    margin-right: 0.2em;
    color: #888;
  }

  .score-total {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .score-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px 10px;
  }

  .score-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
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

  .crown-icon {
    width: 1.2em;
    height: 1.2em;
    vertical-align: middle;
    margin-right: 0.3em;
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
