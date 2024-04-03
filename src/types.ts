import { type GENRES, type BADGES, type CROWNS, type DIFFICULTIES } from './constants'

export interface DonderInfo {
  id?: string
  name?: string
  title?: string
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
}

export interface SongScore {
  title: string
  songNo: string
  details: Partial<Record<DifficultyType, SongScoreDetail>>
}

export interface SongData {
  title: string
  title_kr_official: string
  title_kr_user: string
  bpmMin: number
  bpmMax: number
  levels: Partial<Record<DifficultyType, number>>
  asia: boolean
  length: number
  balloonCounts: Partial<Record<DifficultyType, number>>
  drumrollLengths: Partial<Record<DifficultyType, number>>
  composer: string
  artist: string
  noteCounts: Partial<Record<DifficultyType, number>>
  genres: GenreType[]
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
}

export interface FavoriteSong {
  songNo: string
  title: string
  genre: GenreType
}

export interface PlaydataType {
  score: number;
  good: number;
  ok: number;
  ng: number;
  pound: number;
  combo: number;
  hit:number;
}

export interface TrainingCourse{
  songs: TrainingSong[]
}

export interface TrainingSong{
  songNo: number;
  difiiculty: "easy"|"normal"|"hard"|"oni"|"oni_ura";
  conditions: TrainingCondition[]
}

export interface TrainingCondition{
  name: "good"|"ok"|"bad"|"hit"|"roll";
  type: "more"|"less";
  criteria: number;
}