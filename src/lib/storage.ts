import { DIFFICULTIES } from '../constants'
import type { BadgeType, CrownType, DifficultyType, DonderInfo, ExtensionSetting, Playlist, SongScore, StorageData } from '../types'
import dummyData from './storageDummyData.json'

const STORAGE_KEYS = ['donderInfo', 'scoresByNo', 'playlists', 'settings'] as const
// type StorageKey = typeof STORAGE_KEYS[number]

export class ExtensionStorage implements StorageData {
  private static instance: ExtensionStorage

  donderInfo: DonderInfo = {}
  scoresByNo: Record<string, SongScore> = {}
  playlists: Playlist[] = []
  settings: ExtensionSetting = {
    preferringDifficulty: 'oni',
    language: 'en',
    lastTabIndex: 0
  }

  isLoaded: boolean = false

  private constructor () {}

  public static async getInstance (): Promise<ExtensionStorage> {
    if (ExtensionStorage.instance === undefined) {
      ExtensionStorage.instance = new ExtensionStorage()
      await ExtensionStorage.instance.load()
    }

    return ExtensionStorage.instance
  }

  private async load (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available using default values')

      this.scoresByNo = dummyData.scoresByNo as Record<string, SongScore>
      this.playlists = dummyData.playlists as Playlist[]

      this.isLoaded = true
      return
    }

    const data = await storage.get(STORAGE_KEYS) as StorageData

    this.donderInfo = data.donderInfo ?? this.donderInfo
    this.scoresByNo = data.scoresByNo ?? this.scoresByNo
    this.playlists = data.playlists ?? this.playlists
    this.settings = { ...this.settings, ...data.settings }

    this.isLoaded = true
  }

  async save (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    const k = STORAGE_KEYS
    for (const key of k) {
      await storage.set({ [key]: this[key] })
    }
  }

  async reset (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.error('storage is not available')
      return
    }

    console.log('Resetting storage..')

    this.donderInfo = {}
    this.scoresByNo = {}
    this.playlists = []
    this.settings = {}

    await this.save()
    await storage.clear()
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
