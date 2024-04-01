import { DIFFICULTIES } from '../constants'
import type { BadgeType, CrownType, DifficultyType, SongScore } from '../types'

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
