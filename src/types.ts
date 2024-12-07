import { type GENRES, type BADGES, type CROWNS, type DIFFICULTIES } from './constants'

export interface DonderInfo {
  id?: string
  name?: string
  title?: string
  crownCounts?: Partial<Record<CrownType, number>>
  badgeCounts?: Partial<Record<BadgeType, number>>
  preferredDifficulty?: DifficultyType
}

export type DifficultyType = typeof DIFFICULTIES[number]
export type CrownType = typeof CROWNS[number]
export type BadgeType = typeof BADGES[number]
export type GenreType = typeof GENRES[number]

export interface SearchOptions {
  text: string
  crown: Record<CrownType, boolean>
  badge: Record<BadgeType, boolean>
  minLevel: number
  maxLevel: number
}

export interface SortOptions {
  key: string
  inc: boolean
}

export interface SongScoreDetail {
  crown: CrownType
  badge: BadgeType
  best?: SongScoreDetailBest
}

export interface SongScoreDetailBest {
  score: number
  good: number
  ok: number
  ng: number
  pound: number
  combo: number
  hit: number
}

export interface SongScore {
  title: string
  songNo: string
  details: Partial<Record<DifficultyType, SongScoreDetail>>
}

export interface SongData {
  songNo: string
  order: number
  title: string
  titleKo?: string | null
  aliasKo?: string | null
  titleEn?: string | null
  aliasEn?: string | null
  bpm: {
    min: number
    max: number
  }
  bpmShiver: number
  version: string[]
  isAsiaBanned: number
  isKrBanned: number
  genre: GenreType[]
  artists: string[]
  addedDate: number
  courses: Record<DifficultyType, {
    level: number
    playTime: number
    balloon: number[]
    rollTime: number[]
    maxCombo: number
    maxDensity: number
    dani: string[]
  }>
  isDeleted: number
}

export interface DonforceItem {
  songNo: string
  title: string // to index SongData, maybe removed in the future
  difficulty: DifficultyType
  donforce: number
}

export type Language = 'ja' | 'en' | 'ko'

export interface Storage {
  songsByNo: Record<string, SongScore>
}

export interface Playlist {
  uuid: string
  title: string
  songNoList: string[]
}

export interface ExtensionSetting {
  donderInfo: DonderInfo | undefined
  lastTabIndex?: number
  language?: Language
  preferringDifficulty?: DifficultyType
  disclaimerAgreed?: boolean
}

export interface FavoriteSong {
  songNo: string
  title: string
  genre: GenreType
}

export interface TrainingCourse {
  name: string
  hash: number
  songs: TrainingCourseSong[]
}

export interface TrainingCourseSong {
  songNo: number
  difficulty: 'easy' | 'normal' | 'hard' | 'oni' | 'oni_ura'
  conditions: TrainingCourseCondition[]
}

export interface TrainingCourseCondition {
  type: 'good' | 'ok' | 'bad' | 'combo' | 'roll' | 'hit'
  criterion: number
}
