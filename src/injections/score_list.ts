import { ExtensionStorage } from '../lib/storage'
import SongSearch__SvelteComponent_ from '../components/SongSearch/SongSearch.svelte'
import { parseScores } from '../lib/songs'

export default async (): Promise<void> => {
  const path = window.location.href.split('/').slice(3).join('/')

  let shouldSave = true
  const match = path.match(/taiko_no=(\d+)/)
  if (match !== null) {
    const storage = await ExtensionStorage.getInstance()
    const donderId = match[1]
    if (storage.donderInfo.id !== donderId) {
      shouldSave = false
    }
  }

  // find insert point
  const songListElem = document.getElementById('songList')
  if (songListElem === null) return
  songListElem.style.display = 'none'

  const scores = parseScores()

  if (shouldSave) {
    const storage = await ExtensionStorage.getInstance()
    scores.forEach((score) => { storage.putScore(score) })
    await storage.save()
  }

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
}
