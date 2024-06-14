import type { SongData } from '../types'
import { waitFor } from './utils'

export class SongDB {
  private static instance: SongDB
  private readonly songDataMap = new Map<string, SongData>()

  private constructor () {
  }

  public static async getInstance (): Promise<SongDB> {
    if (SongDB.instance === undefined) {
      SongDB.instance = new SongDB()
      await SongDB.instance.loadSongData()
    }

    return SongDB.instance
  }

  public static async fetchAndStoreSongData (timestamp?: number): Promise<void> {
    timestamp = timestamp ?? 0

    const SONG_DATA_API = `https://taiko.wiki/api/song?after=${timestamp}`
    const res = await fetch(SONG_DATA_API)
    const newSongData = (await res.json()) as SongData[]
    console.log('fetched song data', newSongData)

    // validate?
    // 1. is List?
    if (!Array.isArray(newSongData)) {
      throw new Error('song data is not an array')
    }

    // 2. is SongData?
    const song = newSongData[0]
    if (song === undefined || typeof song !== 'object') {
      throw new Error('song data is not an object')
    }

    for (const item of newSongData) {
      if (item.courses !== undefined) {
        // @ts-ignore
        // TODO: better way to handle this
        item.courses.oni_ura = item.courses["ura"]
      }
    }

    let newSongIdsMap = new Map<string, boolean>()
    for (const song of newSongData) {
      newSongIdsMap.set(song.songNo, true)
    }

    const storage = chrome.storage.local
    try {
      let { songData } = await storage.get('songData') as { songData: SongData[] }

      songData = songData.filter((song) => !newSongIdsMap.get(song.songNo))
      for (const song of newSongData) {
        songData.push(song)
      }

      await storage.set({ songData })
    }
    catch (e) {
      throw new Error('failed to store songdata')
    }
  }

  public static async shouldFetchSongData (): Promise<boolean> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return false
    }

    // should check if it's been a day since last check
    let { recentCheckTime } = (await storage.get('recentCheckTime')) as { recentCheckTime: number }
    recentCheckTime = recentCheckTime ?? 0
    await storage.set({ recentCheckTime: (new Date()).getTime() })

    const now = (new Date()).getTime()
    const CHECK_INTERVAL = 1000 * 60 * 60 * 24 // 1 day

    let ret = recentCheckTime + CHECK_INTERVAL < now
    if (!ret) return false;

    // compare with server
    let { localSongDataVersion } = (await storage.get('localSongDataVersion')) as { localSongDataVersion: number }
    await storage.set({ recentCheckTime: (new Date()).getTime() })

    const RECENT_UPDATE_API = 'https://taiko.wiki/api/song/recent_update'
    const res = await fetch(RECENT_UPDATE_API)
    const serverSongDataVersion = parseInt(await res.text(), 10)
    await storage.set({ localSongDataVersion: serverSongDataVersion })

    console.log('local', localSongDataVersion, 'server', serverSongDataVersion)

    return localSongDataVersion < serverSongDataVersion
  }

  private async loadSongData (): Promise<void> {
    // load song data
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    try {
      if (await SongDB.shouldFetchSongData()) {
        let { localSongDataVersion } = (await storage.get('localSongDataVersion')) as { localSongDataVersion: number }
        await SongDB.fetchAndStoreSongData(localSongDataVersion)
      }
    } catch (e) {
      console.error('failed to fetch song data', e)
    }

    let { songData } = await storage.get('songData') as { songData: SongData[] }

    if (songData === undefined) {
      console.log('using local default song data')
      songData = (await import('../songdata.json')).default as SongData[]
    }

    for (const item of songData) {
      this.songDataMap.set(item.songNo, item)
    }

    console.log('loaded song data', this.songDataMap)
  }

  getSongData (songNo: string): SongData | undefined {
    return this.songDataMap.get(songNo)
  }

  getSongNoByTitle (title: string): string | undefined {
    for (const songNo of this.songDataMap.keys()) {
      const song = this.songDataMap.get(songNo)
      if (song?.title === title) {
        return songNo
      }
    }
    return undefined
  }

  getAll (): Map<string, SongData> {
    return this.songDataMap
  }
}
