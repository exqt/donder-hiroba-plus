import type { SongData } from '../types'
import { waitFor } from './utils'

export class SongDB {
  private static instance: SongDB
  private readonly songDataMap = new Map<string, SongData>()

  localSongDataVersion: number | undefined
  serverSongDataVersion: number | undefined

  private constructor () {
  }

  private getStorage() {
    const storage = chrome.storage.local
    if (storage === undefined) {
      console.warn('storage is not available')
    }
    return storage
  }

  async getLocalSongDataVersion (): Promise<number> {
    if (this.localSongDataVersion === undefined) {
      const storage = this.getStorage()
      const { localSongDataVersion } = await storage.get('localSongDataVersion') as { localSongDataVersion: number }
      this.localSongDataVersion = localSongDataVersion ?? 0
    }
    return this.localSongDataVersion
  }

  async setLocalSongDataVersion (version: number): Promise<void> {
    const storage = this.getStorage()
    await storage.set({ localSongDataVersion: version })
    this.localSongDataVersion = version
  }

  async getServerSongDataVersion (): Promise<number> {
    if (this.serverSongDataVersion === undefined) {
      const RECENT_UPDATE_API = 'https://taiko.wiki/api/song/recent_update'
      const res = await fetch(RECENT_UPDATE_API)
      this.serverSongDataVersion = parseInt(await res.text(), 10)
      await this.setServerSongDataVersion(this.serverSongDataVersion)
    }
    return this.serverSongDataVersion
  }

  async setServerSongDataVersion (version: number): Promise<void> {
    const storage = this.getStorage()
    await storage.set({ serverSongDataVersion: version })
    this.serverSongDataVersion = version
  }

  public static async getInstance (): Promise<SongDB> {
    if (SongDB.instance === undefined) {
      SongDB.instance = new SongDB()
      await SongDB.instance.loadSongData()
    }

    return SongDB.instance
  }

  public async fetchAndStoreSongData (): Promise<void> {
    const storage = this.getStorage()
    const localSongDataVersion = await SongDB.instance.getLocalSongDataVersion()
    const SONG_DATA_API = `https://taiko.wiki/api/song?after=${localSongDataVersion}`
    const res = await fetch(SONG_DATA_API)
    const newSongData = (await res.json()) as SongData[]
    console.log('fetched song data', new Date(localSongDataVersion), newSongData)

    await this.setLocalSongDataVersion(await this.getServerSongDataVersion())

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

  public async shouldFetchSongData (): Promise<boolean> {
    const now = (new Date()).getTime()
    const CHECK_INTERVAL = 1000 * 60 * 60 // 1 hour

    const storage = this.getStorage()
    // should check if it's been a day since last check
    let { recentCheckTime } = (await storage.get('recentCheckTime')) as { recentCheckTime: number }
    recentCheckTime ??= 0

    let ret = recentCheckTime + CHECK_INTERVAL < now
    if (!ret) return false;

    await storage.set({ recentCheckTime: (new Date()).getTime() })

    // compare with server
    const localSongDataVersion = await this.getLocalSongDataVersion()
    const serverSongDataVersion = await this.getServerSongDataVersion()
    console.log('local', localSongDataVersion, 'server', serverSongDataVersion)

    return localSongDataVersion < serverSongDataVersion
  }

  private async loadSongData (): Promise<void> {
    // load song data
    const storage = this.getStorage()

    try {
      if (await this.shouldFetchSongData()) {
        await this.fetchAndStoreSongData()
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
