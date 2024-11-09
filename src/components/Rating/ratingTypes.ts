export type Difficulty = 'easy' | 'normal' | 'hard' | 'oni' | 'ura'

export type Crown = 'played' | 'silver' | 'gold' | 'donderfull' | null
export type Badge = 'rainbow' | 'purple' | 'pink' | 'gold' | 'silver' | 'bronze' | 'white' | null

export interface Clear {
  crown: Crown
  badge: Badge
}

export interface ClearData {
  title: string
  songNo: string
  difficulty: Partial<Record<Difficulty, Clear>>
}

export interface ScoreData {
  title: string
  songNo: string
  difficulty: Partial<Record<Difficulty, DifficultyScoreData>>
}

export interface ScoreResponseData {
  songNo: string
  body: Record<Difficulty, string | null>
}

export interface DifficultyScoreData {
  crown: Crown
  badge: Badge
  score: number
  ranking: number
  good: number
  ok: number
  bad: number
  maxCombo: number
  roll: number
  count: Count
}

export interface Count {
  play: number
  clear: number
  fullcombo: number
  donderfullcombo: number
}
