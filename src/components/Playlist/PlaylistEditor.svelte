<script lang="ts">
  import { onMount } from 'svelte'
  import { type PlaylistsStore, updateFavoriteSongList } from '../../lib/playlist'
  import Button from '../Common/Button.svelte'
  import { SongDB } from '../../lib/songDB'

  import type { FavoriteSong } from '../../types'
  import FavoriteSongs from './FavoriteSongs.svelte'
  import { ExtensionStorage } from '../../lib/storage'
  import PlaylistContainer from './PlaylistContainer.svelte'
  import { genUUID } from '../../lib/utils'

  export let tckt: string
  export let playlists: PlaylistsStore
  export let favoriteSongList: FavoriteSong[] = []

  const save = async (): Promise<void> => {
    const songNoList = favoriteSongList.map((item) => item.songNo)
    console.log(songNoList)
    if (songNoList[0] !== '1') return

    try {
      await updateFavoriteSongList(songNoList, tckt)
    } catch (e) {
      console.error(e)
      alert('Failed to save favorite songs')
      return
    }

    sessionStorage.removeItem('favoriteSongList')
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

  const onChangeFavorite = (favoriteSongs: FavoriteSong[]): void => {
    favoriteSongList = favoriteSongs
    sessionStorage.setItem('favoriteSongList', JSON.stringify(favoriteSongs))
  }

  let songDB: SongDB
  let storage: ExtensionStorage

  onMount(async () => {
    console.log('tckt', tckt)
    console.log('playlists', playlists)
    console.log('currentFavoriteSongList', favoriteSongList)
    songDB = await SongDB.getInstance()
    storage = await ExtensionStorage.getInstance()

    const t = sessionStorage.getItem('favoriteSongList')
    if (t !== null) {
      favoriteSongList = JSON.parse(t)
    }
  })

</script>

<div class="wrapper">
  <PlaylistContainer {playlists} {songDB} />
  <div class="button-container">
    <Button on:click={importCurrentAsPlaylist}>
      ↑ Import ↑
    </Button>
    <Button on:click={save}>
      Save
    </Button>
  </div>
  <div class="header">
    Favorites Folder
  </div>
  <FavoriteSongs
    {songDB}
    {storage}
    onChange={onChangeFavorite}
    {favoriteSongList}
  />
</div>

<style>
  .wrapper {
    width: 290px;
    background: #FFCC00;
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
    text-align: center;
    background: #ff5333;
    color: #ffffff;
    text-shadow: -1px -1px 1px #aa0000, 1px -1px 1px #aa0000, -1px 1px 1px #aa0000, 1px 1px 1px #aa0000;
    margin-bottom: 16px;
  }
</style>
