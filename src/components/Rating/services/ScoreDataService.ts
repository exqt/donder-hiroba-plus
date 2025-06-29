import type { DifficultyScoreData } from '../ratingTypes'
import type RecentScoreStorage from '../recentScoreStorage'

export interface SortedScoreData {
  songName: string
  difficulty: string
  score: DifficultyScoreData
  songNo: string
}

export function updateScoreDataSorted (storage: RecentScoreStorage): {
  scoreDataSorted: SortedScoreData[]
  totalPlayCount: string
} {
  const scoreDataSorted: SortedScoreData[] = []
  let totalPlay = 0
  let totalClear = 0
  let totalFullcombo = 0
  let totalDonderfullcombo = 0

  for (const [songNo, scoreData] of Object.entries(storage.getMap())) {
    for (const [difficulty, score] of Object.entries(scoreData.difficulty)) {
      if (difficulty !== 'oni' && difficulty !== 'ura') continue
      scoreDataSorted.push({
        songName: scoreData.title,
        difficulty,
        score,
        songNo
      })
      totalPlay += score.count.play
      totalClear += score.count.clear
      totalFullcombo += score.count.fullcombo
      totalDonderfullcombo += score.count.donderfullcombo
    }
  }

  scoreDataSorted.sort((a, b) => b.score.count.play - a.score.count.play)
  const totalPlayCount = `${totalPlay} / ${totalClear} / ${totalFullcombo} / ${totalDonderfullcombo}`

  return { scoreDataSorted, totalPlayCount }
}
