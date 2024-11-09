import type { ScoreData } from "./ratingTypes";

class RecentScoreStorage {
  private scoreDataMap: Record<string, ScoreData> = {}
  private lastUpdated: string | null = null

  constructor() {
    this.scoreDataMap = {}
    this.lastUpdated = null
  }

  public async loadFromChromeStorage() {
    const result = await chrome.storage.local.get(['recentScores', 'lastUpdated'])
    if (result.recentScores) {
      this.scoreDataMap = result.recentScores
    }
    if (result.lastUpdated) {
      this.lastUpdated = result.lastUpdated
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear().toString().slice(-2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  private async saveToStorage() {
    await chrome.storage.local.set({
      recentScores: this.scoreDataMap,
      lastUpdated: this.formatDate(new Date())
    })
  }

  async mergeMap(scoreDataMap: Record<string, ScoreData>) {
    for (const [songNo, scoreData] of Object.entries(scoreDataMap)) {
      await this.mergeSingle(songNo, scoreData)
    }
  }

  async mergeSingle(songNo: string, scoreData: ScoreData) {
    if (this.scoreDataMap[songNo] === undefined) {
      this.scoreDataMap[songNo] = scoreData
    } else {
      this.scoreDataMap[songNo] = {
        ...this.scoreDataMap[songNo],
        difficulty: {
          ...this.scoreDataMap[songNo].difficulty,
          ...scoreData.difficulty
        }
      }
    }
    await this.saveToStorage()
  }

  getMap() {
    return this.scoreDataMap
  }

  getLastUpdated() {
    return this.lastUpdated
  }
}

export default RecentScoreStorage