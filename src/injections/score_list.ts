import { ScoreStorage } from '../lib/scores'
import SongSearch__SvelteComponent_ from '../components/SongSearch/SongSearch.svelte'
import { parseScores } from '../lib/songs'
import { SettingsStorage } from '../lib/settings'

export default async (): Promise<void> => {
  const path = window.location.href.split('/').slice(3).join('/')

  let shouldSave = true
  const match = path.match(/taiko_no=(\d+)/)
  if (match !== null) {
    const settingsStorage = await SettingsStorage.getInstance()
    const donderId = match[1]
    if (settingsStorage?.donderInfo?.id !== donderId) {
      shouldSave = false
    }
  }

  // find insert point
  const songListElem = document.getElementById('songList')
  if (songListElem === null) return
  songListElem.style.display = 'none'

  const scores = parseScores()

  if (shouldSave) {
    const storage = await ScoreStorage.getInstance()
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
