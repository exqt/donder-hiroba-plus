import hiroba, { parse } from 'node-hiroba'
import lzutf8 from 'lzutf8'
import type { ClearData } from '../ratingTypes'
import { waitFor } from '../../../lib/utils'
import { getRecentScoreData, type RecentScoreData } from '../recentScore'
import type RecentScoreStorage from '../recentScoreStorage'
import { clearTop50RatingCache } from '../../../lib/rating'
import { DonderHiroba, type DaniNo, type CardData, type ScoreData, type Summary, type Difficulty } from 'hiroba-js'

type TaikoProfile = {
  taikoNo: string;
  nickname: string;
  crown: {
    donderfull: number;
    gold: number;
    silver: number;
  };
  badge: {
    rainbow: number;
    purple: number;
    pink: number;
    gold: number;
    silver: number;
    bronze: number;
    white: number;
  };
  dani: {
    dan: "5kyu" | "4kyu" | "3kyu" | "2kyu" | "1kyu" | "1dan" | "2dan" | "3dan" | "4dan" | "5dan" | "6dan" | "7dan" | "8dan" | "9dan" | "10dan" | "kuroto" | "meijin" | "chojin" | "tatsujin";
    type: "gold" | "red";
    frame: "gold" | "silver" | "rainbow";
  } | null;
}

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
    cardData: CardData & { summary?: Summary } | null,
    clearData: ClearData[],
    scoreDataMap?: Record<string, ScoreData>
  ): Promise<void> {
    let data


    const fetchDani = async (cardData: CardData & { summary?: Summary }) => {
      const daniPass = await DonderHiroba.func.getDaniPass({ taikoNo: cardData.taikoNumber });
      const REGULAR_DAN = ["senpo", "jiho", "chiuken", "fukusho", "taisho", "beginner", "10kyu", "9kyu", "8kyu", "7kyu", "6kyu", "5kyu", "4kyu", "3kyu", "2kyu", "1kyu", "1dan", "2dan", "3dan", "4dan", "5dan", "6dan", "7dan", "8dan", "9dan", "10dan", "kuroto", "meijin", "chojin", "tatsujin"] as const;
      for (let i = 19; i >= 1; i--) {
        const danino = i as DaniNo;
        const pass = daniPass[danino];
        if (!pass) continue;
        const dani = {
          dan: REGULAR_DAN[i + 10],
          type: pass.pass,
          frame: pass.frame === "donderfull" ? 'rainbow' : pass.frame
        };
        return dani as TaikoProfile['dani'];
      }
      return null;
    }

    if (cardData === null) {
      alert('Donder Hiroba data is required to upload to Taiko.wiki rating.')
      return;
    }

    const dani = await fetchDani(cardData);

    const taikoProfile: TaikoProfile = {
      nickname: cardData.nickname,
      taikoNo: cardData.taikoNumber,
      crown: cardData.summary?.crown ?? {
        donderfull: 0,
        gold: 0,
        silver: 0
      },
      badge: cardData.summary?.badge ?? {
        rainbow: 0,
        purple: 0,
        pink: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        white: 0
      },
      dani
    }

    if (scoreDataMap !== undefined) {
      await storage.mergeMap(scoreDataMap)
      data = JSON.stringify({
        taikoProfile,
        clearData,
        scoreData: storage.getMap()
      })
    } else {
      data = JSON.stringify({
        taikoProfile,
        clearData
      })
    }

    if (scoreDataMap !== undefined) {
      for (const song of clearData) {
        let scoreData = scoreDataMap[song.songNo]
        const difficulties: Difficulty[] = ['easy', 'normal', 'hard', 'oni', 'ura']
        for (const diff of difficulties) {
          if (scoreData?.difficulty[diff] !== undefined) {
            scoreData.difficulty[diff] = {
              ...scoreData.difficulty[diff],
              ranking: 0
            }
          }
        }
      }
    }

    console.log(data)

    await fetch('https://rating.taiko.wiki/api/v1/rating/upload', {
        method: 'post',
        body: lzutf8.compress(JSON.stringify(data), { outputEncoding: 'Base64' }),
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
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
    cardData: CardData & { summary?: Summary } | null,
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
