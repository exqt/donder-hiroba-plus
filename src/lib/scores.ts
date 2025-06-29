import { DIFFICULTIES } from '../constants'
import type { BadgeType, CrownType, DifficultyType, SongScore } from '../types'
import { parseScores } from './songs'

const STORAGE_KEY = 'scoresByNo'

export class ScoreStorage {
  private static instance: ScoreStorage

  scoresByNo: Record<string, SongScore> = {}

  private constructor () {}

  public static async getInstance (): Promise<ScoreStorage> {
    if (ScoreStorage.instance === undefined) {
      ScoreStorage.instance = new ScoreStorage()
      await ScoreStorage.instance.load()
    }

    return ScoreStorage.instance
  }

  private async load (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available using default values')
      this.scoresByNo = (await import('./dummyData/scoresByNo.json')).default as Record<string, SongScore>
      return
    }

    const data = (await storage.get(STORAGE_KEY))[STORAGE_KEY] as Record<string, SongScore>
    this.scoresByNo = data ?? this.scoresByNo
  }

  async save (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    await storage.set({ [STORAGE_KEY]: this.scoresByNo })
  }

  async reset (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.error('storage is not available')
      return
    }

    this.scoresByNo = {}
    await this.save()
  }

  putScore (score: SongScore): void {
    this.scoresByNo[score.songNo] = score
  }

  getScoreByNo (songNo: string): SongScore | undefined {
    return this.scoresByNo[songNo]
  }

  getAllScores (): SongScore[] {
    const scores: SongScore[] = []
    for (const songNo in this.scoresByNo) {
      scores.push(this.scoresByNo[songNo])
    }

    return scores
  }

  countBadgesAndCrowns (filterDiffs?: DifficultyType[]): { badges: Record<BadgeType, number>, crowns: Record<CrownType, number> } {
    const diffs = filterDiffs ?? DIFFICULTIES

    const badges: Record<BadgeType, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
    }

    const crowns: Record<CrownType, number> = {
      none: 0, silver: 0, gold: 0, donderfull: 0
    }

    for (const songNo in this.scoresByNo) {
      const score = this.scoresByNo[songNo]

      for (const difficulty of DIFFICULTIES) {
        if (!diffs.includes(difficulty)) continue

        const detail = score.details[difficulty]
        if (detail === undefined) continue

        badges[detail.badge] += 1
        crowns[detail.crown] += 1
      }
    }

    return { badges, crowns }
  }
}

export const updateSongScoreAllForLocal = async (): Promise<void> => {
  const scoreStorage = await ScoreStorage.getInstance()
  try {
    // get tckt
    const mypage = await fetch('https://donderhiroba.jp/mypage_top.php')
    const mypageDoc = new DOMParser().parseFromString(await mypage.text(), 'text/html')
    const tckt = mypageDoc.getElementById('content')?.querySelector('#_tckt')?.textContent
    if (tckt === undefined || tckt === null) {
      alert('server error')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await fetch('https://donderhiroba.jp/ajax/update_score.php', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: `_tckt=${tckt}`
    })

    // visit every genre page
    const docs = []
    for (let i = 1; i <= 8; i++) {
      const url = `https://donderhiroba.jp/score_list.php?genre=${i}`
      const response = await fetch(url)
      const text = await response.text()
      const doc = new DOMParser().parseFromString(text, 'text/html')
      docs.push(doc)
    }

    docs.forEach((doc) => {
      const scores = parseScores(doc)
      scores.forEach((score) => { scoreStorage.putScore(score) })
    })
    await scoreStorage.save()
    alert('Song scores updated successfully!')
  } catch (e) {
    console.error(e)
    alert('Failed to update song scores. Please try again later.')
  }
}
