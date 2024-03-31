import { ExtensionStorage } from '../lib/storage'
import SongSearch__SvelteComponent_ from '../components/SongSearch/SongSearch.svelte'
import type { FavoriteSong, GenreType } from '../types'

export default async (): Promise<void> => {
  /*
  const storage = await ExtensionStorage.getInstance()
  const scores = storage.getAllScores()

  const songs: FavoriteSong[] = []
  const songsElems = document.querySelectorAll('.songNameArea')
  for (const songElem of songsElems) {
    const aElem = songElem.querySelector('a')
    if (aElem === null) continue
    const songNo = /song_no_(\d+)=(\d+)/.exec(aElem.href)?.[2]
    const genre = /songNameFont(\w+)/.exec(songElem.className)?.[1] as GenreType
    const title = songElem.textContent?.trim()
    if (songNo !== undefined) {
      songs.push({
        genre: genre ?? 'unknown',
        songNo,
        title: title ?? 'unknown'
      })
    }
  }

  // find insert point
  const songListElem = document.getElementById('songList')
  if (songListElem === null) return
  // songListElem.style.display = 'none'

  const songListParentElem = songListElem.parentElement
  if (songListParentElem === null) return

  const insertionPoint = document.createElement('div')
  songListParentElem.insertBefore(insertionPoint, songListElem)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const songSearch = new SongSearch__SvelteComponent_({
    target: insertionPoint,
    props: {
      scores
    }
  })
  */
}
