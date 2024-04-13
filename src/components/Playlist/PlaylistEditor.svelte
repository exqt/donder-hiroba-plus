<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import { PlaylistsStore, updateFavoriteSongList, decodeBase64 } from '../../lib/playlist'
  import Button from '../Common/Button.svelte'
  import { SongDB } from '../../lib/songDB'

  import type { FavoriteSong, Language } from '../../types'
  import FavoriteSongs from './FavoriteSongs.svelte'
  import { ScoreStorage } from '../../lib/scores'
  import PlaylistContainer from './PlaylistContainer.svelte'
  import { genUUID } from '../../lib/utils'
  import { SettingsStorage } from '../../lib/settings'

  export let tckt: string
  export let favoriteSongList: FavoriteSong[] = []

  const save = async (): Promise<void> => {
    const songNoList = favoriteSongList.map((item) => item.songNo)

    try {
      await updateFavoriteSongList(songNoList, tckt)
    } catch (e) {
      console.error(e)
      alert('Failed to save favorite songs')
      return
    }

    window.location.href = 'https://donderhiroba.jp/mypage_top.php'
  }

  const importCurrentAsPlaylist = async (): Promise<void> => {
    const date = new Date()
    const padZero = (num: number): string => num.toString().padStart(2, '0')
    const dateStr = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`
    const timeStr = `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`
    await playlists.add({
      uuid: genUUID(),
      title: dateStr + ' ' + timeStr,
      songNoList: favoriteSongList.map((item) => item.songNo)
    })
  }

  const decodePlaylist = async (): Promise<void> => {
    const t = prompt('Enter the playlist string')
    if (t === null) {
      return
    }

    let [title, base64] = t.split('|')
    title = title.replaceAll('_', ' ')
    const songNoList = decodeBase64(base64)
    await playlists.add({
      uuid: genUUID(),
      title,
      songNoList
    })
  }

  let songDB: SongDB
  let scoreStorage: ScoreStorage
  let settingsStorage: SettingsStorage
  let playlists: PlaylistsStore
  let language: Language = 'ja'

  setContext('tckt', tckt)
  onMount(async () => {
    songDB = await SongDB.getInstance()
    scoreStorage = await ScoreStorage.getInstance()
    settingsStorage = await SettingsStorage.getInstance()
    playlists = await PlaylistsStore.getInstance()
    language = settingsStorage.language
  })

</script>

<div class="wrapper">
  <div class="header">
    My Playlist
  </div>
  <div class="button-container">
    <Button on:click={decodePlaylist}>
      Decode Base64
    </Button>
  </div>
  {#if playlists}
    <PlaylistContainer
      {scoreStorage}
      {settingsStorage}
      {playlists}
      {songDB}
    />
  {/if}
  <div class="header">
    Favorites Folder
  </div>
  <div class="button-container">
    <Button on:click={importCurrentAsPlaylist}>
      ↑ Import ↑
    </Button>
    <Button on:click={save}>
      Save
    </Button>
  </div>
  <FavoriteSongs
    {songDB}
    {scoreStorage}
    {language}
    {favoriteSongList}
    {playlists}
  />
</div>

<style>
  .wrapper {
    width: 290px;
    background: #FFCC00;
    border-radius: 8px;
    margin: 0 auto;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    overflow: hidden;
  }

  .button-container {
    display: flex;
    justify-content: space-around;
    padding: 4px 0;
    background-color: #ff5333;
  }

  .header {
    padding-top: 5px;
    height: 25px;
    font-size: 16px;
    text-align: center;
    background: #ff5333;
    color: #ffffff;
    text-shadow: -1px -1px 1px #aa0000, 1px -1px 1px #aa0000, -1px 1px 1px #aa0000, 1px 1px 1px #aa0000;
  }
</style>
