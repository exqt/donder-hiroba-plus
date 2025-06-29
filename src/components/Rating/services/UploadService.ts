import hiroba, { parse } from 'node-hiroba'
import type { CardData, ScoreData } from 'node-hiroba/types'
import lzutf8 from 'lzutf8'
import type { ClearData } from '../ratingTypes'
import { waitFor } from '../../../lib/utils'
import { getRecentScoreData, type RecentScoreData } from '../recentScore'
import type RecentScoreStorage from '../recentScoreStorage'
import { clearTop50RatingCache } from '../../../lib/rating'

export class UploadService {
  private readonly wikiOrigin = 'https://taiko.wiki'
  private waitTime = 3000

  async checkWikiLogin (): Promise<boolean> {
    const wikiUser = await (await fetch(this.wikiOrigin + '/api/user', { credentials: 'include' })).json()
    return wikiUser.logined === true
  }

  async fetchScoreForSong (songNo: string, clearData: ClearData): Promise<ScoreData | null> {
    const response: { songNo: string, body: { oni?: string, ura?: string } } =
      { songNo, body: {} }

    while (true) {
      try {
        if (clearData.difficulty.oni === undefined) break
        response.body.oni = await (await fetch(
          `https://donderhiroba.jp/score_detail.php?song_no=${songNo}&level=${4}`
        )).text()
        break
      } catch {
        await waitFor(this.waitTime)
        this.waitTime *= 2
      }
    }

    while (true) {
      try {
        if (clearData.difficulty.ura === undefined) break
        response.body.ura = await (await fetch(
          `https://donderhiroba.jp/score_detail.php?song_no=${songNo}&level=${5}`
        )).text()
        break
      } catch {
        await waitFor(this.waitTime)
        this.waitTime *= 2
      }
    }

    if (response.body.oni === undefined && response.body.ura === undefined) return null

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const parsed = parse.parseScoreData(response as any)
    return parsed ?? null
  }

  async uploadToWiki (
    storage: RecentScoreStorage,
    donderData: CardData | null,
    clearData: ClearData[],
    scoreDataMap?: Record<string, ScoreData>
  ): Promise<void> {
    let data
    if (scoreDataMap !== undefined) {
      await storage.mergeMap(scoreDataMap)
      data = JSON.stringify({
        donderData,
        clearData,
        scoreData: storage.getMap()
      })
    } else {
      data = JSON.stringify({
        donderData,
        clearData
      })
    }

    const compressedBody = lzutf8.compress(data, {
      outputEncoding: 'ByteArray'
    }) as Uint8Array

    await fetch(this.wikiOrigin + '/api/user/donder', {
      credentials: 'include',
      method: 'POST',
      body: compressedBody,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async sendClearData (
    storage: RecentScoreStorage,
    cardData: CardData | null,
    onProgress: (message: string) => void
  ): Promise<void> {
    onProgress('Fetching clear data...')
    await hiroba.updateScore(null)
    const clearData = await hiroba.getClearData(null)

    onProgress('Uploading clear data...')
    await this.uploadToWiki(storage, cardData, clearData)
  }

  async sendAllData (
    storage: RecentScoreStorage,
    cardData: CardData | null,
    onProgress: (message: string) => void
  ): Promise<void> {
    onProgress('Fetching clear data...')
    await hiroba.updateScore(null)
    const clearData = await hiroba.getClearData(null)
    const prevScoreDataMap = { ...storage.getMap() }

    const songNameToSongNos = new Map<string, string[]>()
    for (const song of clearData) {
      if (songNameToSongNos.has(song.title)) {
        songNameToSongNos.get(song.title)?.push(song.songNo)
        console.log(song.title, songNameToSongNos.get(song.title))
      } else {
        songNameToSongNos.set(song.title, [song.songNo])
      }
    }

    onProgress('Fetching recent score data...')

    let complete = 0
    onProgress('Fetch score data... (0/?)')

    const recentScoreData: RecentScoreData[] = []
    const firstPage = await getRecentScoreData(1)
    recentScoreData.push(...firstPage)
    complete++
    onProgress(`Fetch score data... (${complete}/?)`)

    let shouldStop = false
    while (!shouldStop) {
      const nextPage = await getRecentScoreData(complete + 1)

      // terminate condition 1: no more data
      let allSame = true
      for (let i = 0; i < nextPage.length; i++) {
        if (nextPage[i].songName !== firstPage[i].songName ||
          nextPage[i].difficulty !== firstPage[i].difficulty
        ) {
          allSame = false
          break
        }
      }
      if (allSame) {
        shouldStop = true
      }

      // terminate condition 2: no more plays
      for (const item of nextPage) {
        const songNos = songNameToSongNos.get(item.songName)
        if (songNos === undefined || songNos.length > 1) {
          continue
        }
        const scoreData = prevScoreDataMap[songNos[0]]

        if (item.scoreData.count.play ===
        scoreData?.difficulty?.[item.difficulty]?.count.play) {
          shouldStop = true
        }
      }

      recentScoreData.push(...nextPage)
      complete++
      onProgress(`Fetch score data... (${complete}/?)`)
    }

    const nextPage = await getRecentScoreData(complete + 1)
    recentScoreData.push(...nextPage)
    complete++
    onProgress(`Fetch score data... (${complete}/?)`)

    const seenDuplicatedSongNames = new Set<string>()
    const scoreDataMap: Record<string, ScoreData> = {}
    for (const recentScore of recentScoreData) {
      const songNos = songNameToSongNos.get(recentScore.songName)
      if (songNos === undefined) {
        continue
      }
      if (songNos.length > 1) {
        seenDuplicatedSongNames.add(recentScore.songName)
        continue
      }
      const songNo = songNos[0]

      const score = recentScore.scoreData
      if (scoreDataMap[songNo] === undefined) {
        scoreDataMap[songNo] = {
          title: recentScore.songName,
          songNo,
          difficulty: {}
        }
      }
      scoreDataMap[songNo].difficulty[recentScore.difficulty] = score
    }

    for (const [songName, songNos] of songNameToSongNos.entries()) {
      if (songNos !== undefined && songNos.length > 1) {
        if (!seenDuplicatedSongNames.has(songName)) {
          continue
        }
        for (const songNo of songNos) {
          const songClearData = clearData.find(song => song.songNo === songNo)
          if (songClearData !== undefined) {
            const score = await this.fetchScoreForSong(songNo, songClearData)
            if (score !== null) {
              scoreDataMap[songNo] = score
            }
          }
        }
      }
    }

    await clearTop50RatingCache()
    await this.uploadToWiki(storage, cardData, clearData, scoreDataMap)
  }
}
