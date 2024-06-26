import type { BadgeType, CrownType, DifficultyType, DonforceItem, SongScore } from '../types'
import type { Analyzer } from './analyzer'
import { type SongDB } from './songDB'

export const BADGE_COEF: Record<BadgeType, number> = {
  0: 0.00, // none
  1: 0.00, // none
  2: 0.50, // white
  3: 0.60, // bronze
  4: 0.70, // silver
  5: 0.80, // gold
  6: 0.90, // pink
  7: 0.95, // purple
  8: 1.00 // rainbow
}

export const CROWN_COEF: Record<CrownType, number> = {
  none: 0.0,
  silver: 0.85,
  gold: 1.0,
  donderfull: 1.1
}

export const calculateDonforce = (badge: BadgeType, crown: CrownType, level: number): number => {
  const badgeCoefficient = BADGE_COEF[badge] ?? 0
  const crownCoefficient = CROWN_COEF[crown] ?? 0
  return 6.0 * Math.pow(1.3, level - 6.0) * badgeCoefficient * crownCoefficient
}

export const getDonforceTopK = (scores: SongScore[], songDB: SongDB, analyzer: Analyzer, diffs: DifficultyType[], k: number): DonforceItem[] => {
  const items: DonforceItem[] = []

  scores.forEach((s) => {
    for (const diff of diffs) {
      const detail = s.details[diff]
      if (detail === undefined) continue

      const level = analyzer.getLevelWidthSub(s.songNo, diff)
      if (level === undefined) continue

      const donforce = calculateDonforce(detail.badge, detail.crown, level)
      if (donforce === 0) continue

      items.push({
        songNo: s.songNo,
        difficulty: diff,
        title: s.title,
        donforce
      })
    }
  })

  return items
    .toSorted((a, b) => b.donforce - a.donforce)
    .slice(0, k)
}
