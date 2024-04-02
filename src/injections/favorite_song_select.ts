import PlaylistEditor from '../components/Playlist/PlaylistEditor.svelte'
import { parseCurrentFavoriteSongList } from '../lib/playlist'

export default async (): Promise<void> => {
  const favoriteSong = document.querySelector('.favoriteSong')
  if (favoriteSong === null) {
    return
  }

  const origin = favoriteSong.children[0] as HTMLElement
  origin.style.display = 'none'

  const div = document.createElement('div')
  favoriteSong.insertBefore(div, favoriteSong.firstChild)

  const tcktElem = document.querySelector('#_tckt')
  if (tcktElem === null) {
    return
  }

  const tckt = tcktElem.attributes.getNamedItem('value')?.value
  if (tckt === undefined) {
    return
  }

  const currentFavoriteSongList = parseCurrentFavoriteSongList()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const playlistEditor = new PlaylistEditor({
    target: div,
    props: {
      tckt,
      favoriteSongList: currentFavoriteSongList
    }
  })
}
