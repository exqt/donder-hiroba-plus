import type { SongData } from '../types'

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

  private async loadSongData (): Promise<void> {
    const songdata = await import('../songdata.json')
    const s = songdata.default as Record<string, SongData>
    for (const songNo in s) {
      this.songDataMap.set(songNo, s[songNo])
    }
  }

  getSongData (songNo: string): SongData | undefined {
    return this.songDataMap.get(songNo)
  }
}
