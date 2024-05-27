import { ScoreStorage } from '../lib/scores'

const INTERVAL_TIME = 500

const insertData = (scoreDataInput: HTMLInputElement, storage: ScoreStorage): void => {
  if (scoreDataInput.value !== '') return

  const scores = storage.getAllScores()
  const str = JSON.stringify(scores)
  scoreDataInput.value = str
  scoreDataInput.dispatchEvent(new Event('change'))
}

export default async (): Promise<void> => {
  const storage = await ScoreStorage.getInstance()

  setInterval(() => {
    const path = window.location.href.split('/').slice(3).join('/')
    if (!path.startsWith('diffchart')) return

    const scoreDataInput = document.querySelector('#scoredata_input')
    if (scoreDataInput === null) return

    insertData(scoreDataInput as HTMLInputElement, storage)
  }, INTERVAL_TIME)
}
