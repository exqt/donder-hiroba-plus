import type { DifficultyScoreData, Crown } from 'node-hiroba/types'

export const getAccuracy = (difficultyScoreData: DifficultyScoreData, maxCombo: number): number => {
  return ((difficultyScoreData.good * 2 + difficultyScoreData.ok) * 100 / (maxCombo * 2)) + Math.min(5, difficultyScoreData.roll / 100)
}

export function getSongRating (accuracy: number, crown: Crown, measureValue: number): number {
  const compensatedAccuracy = getCompensated(accuracy)
  return Math.round(measureValue * compensatedAccuracy * getCrownBonus(crown, accuracy) / 1000)
}

export const getCrownBonus = (crown: Crown, acc: number): number => {
  if (acc < 85) return 0.7
  switch (crown) {
    case ('played'): {
      return 0.7
    }
    case ('silver'): {
      return 1
    }
    case ('gold'): {
      return 1.05
    }
    case ('donderfull'): {
      return 1.1
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
  } else if (multiplied <= 950000) {
    compensated = (3 / 2) * (multiplied - 750000) + 650000
  } else {
    compensated = (150000 / Math.log(16)) * Math.log((multiplied - 950000) / 10000 + 1) + 950000
  }

  return compensated
}

export interface UserRatingData {
  currentRating: number
  currentExp: number | null
  ratingDataWithScoreData: Array<{
    songNo: number
    difficulty: 'oni' | 'ura'
    songRating: {
      value: number
      accuracy: number
      measureValue: number
    }
    scoreData: {
      crown: 'played' | 'silver' | 'gold' | 'donderfull'
      badge: 'rainbow' | 'purple' | 'pink' | 'gold' | 'silver' | 'bronze' | 'white' | null
      score: number
      ranking: number
      good: number
      ok: number
      bad: number
      maxCombo: number
      roll: number
      count: {
        play: number
        clear: number
        fullcombo: number
        donderfullcombo: number
      }
    } | null
  }>
}

export const getTop50Rating = async (): Promise<UserRatingData> => {
  // get cache from local storage

  let { top50ratingScores, top50RatingLastUpdated } =
    await chrome.storage.local.get(['top50ratingScores', 'top50RatingLastUpdated'])

  if (top50ratingScores !== undefined && top50RatingLastUpdated !== undefined) {
    const lastUpdated = new Date(top50RatingLastUpdated as number)
    const now = new Date()
    const diff = now.getTime() - lastUpdated.getTime()
    const diffHours = diff / (1000 * 60 * 60)
    if (diffHours < 24) {
      console.log('returning cached top50ratingScores', top50ratingScores)
      return top50ratingScores
    }
  }

  const url = 'https://taiko.wiki/api/user/rating'
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized access - 401')
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }

  const data = await response.json()
  top50ratingScores = data
  const lastUpdated = (new Date()).getTime()
  await chrome.storage.local.set({
    top50ratingScores,
    top50RatingLastUpdated: lastUpdated
  })

  return top50ratingScores
}

export const clearTop50RatingCache = async (): Promise<void> => {
  await chrome.storage.local.remove(['top50ratingScores', 'top50RatingLastUpdated'])
}
