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
