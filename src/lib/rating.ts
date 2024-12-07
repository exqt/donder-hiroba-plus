import type { DifficultyScoreData, Crown } from 'node-hiroba/types'

export const getAccuracy = (difficultyScoreData: DifficultyScoreData, maxCombo: number): number => {
  return ((difficultyScoreData.good * 2 + difficultyScoreData.ok) * 100 / (maxCombo * 2)) + Math.min(5, difficultyScoreData.roll / 100)
}

export function getSongRating (accuracy: number, crown: Crown, measureValue: number): number {
  const compensatedAccuracy = getCompensated(accuracy)
  return Math.round(measureValue * compensatedAccuracy * getCrownBonus(crown) / 1000)
}

export const getCrownBonus = (crown: Crown): number => {
  switch (crown) {
    case ('played'): {
      return 0.7
    }
    case ('silver'): {
      return 1
    }
    case ('gold'): {
      return 1.1
    }
    case ('donderfull'): {
      return 1.15
    }
    default: {
      return 0
    }
  }
}

export function getCompensated (accuracy: number): number {
  const multiplied = accuracy * 10000

  let compensated: number
  if (multiplied < 600000) {
    compensated = Math.exp(Math.log(400001) / 600000 * multiplied) - 1
  } else if (multiplied < 750000) {
    compensated = (5 / 3) * (multiplied - 600000) + 400000
  } else if (multiplied < 950000) {
    compensated = (3 / 2) * (multiplied - 750000) + 650000
  } else {
    compensated = (150000 / Math.log(16)) * Math.log((multiplied - 950000) / 10000 + 1) + 950000
  }

  return compensated
}
