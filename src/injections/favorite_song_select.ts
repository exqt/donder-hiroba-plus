import PlaylistEditor from '../components/Playlist/PlaylistEditor.svelte'
import { PlaylistsStore, parseCurrentFavoriteSongList } from '../lib/playlist'

export default async (): Promise<void> => {
  console.log('fav')
  const favoriteSong = document.querySelector('.favoriteSong')
  if (favoriteSong === null) {
    return
  }

  const div = document.createElement('div')
  favoriteSong.insertBefore(div, favoriteSong.firstChild)

  const tcktElem = document.querySelector('#_tckt')
  console.log(tcktElem)
  if (tcktElem === null) {
    return
  }

  const tckt = tcktElem.attributes.getNamedItem('value')?.value
  if (tckt === undefined) {
    return
  }

  const playlists = new PlaylistsStore()
  await playlists.load()

  const currentFavoriteSongList = parseCurrentFavoriteSongList()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const playlistEditor = new PlaylistEditor({
    target: div,
    props: {
      tckt,
      playlists,
      favoriteSongList: currentFavoriteSongList
    }
  })
}
