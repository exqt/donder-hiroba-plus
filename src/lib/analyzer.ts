import type { DifficultyType } from '../types'
import { data } from './analyzerData'
import { SongDB } from './songDB'

export class Analyzer {
  private static instance: Analyzer
  private static songDB: SongDB
  data: Record<string, Record<DifficultyType, number>> = {}

  private constructor () {
  }

  public static async getInstance (): Promise<Analyzer> {
    if (Analyzer.instance === undefined) {
      Analyzer.instance = new Analyzer()
      await Analyzer.instance.loadSongData()
      Analyzer.songDB = await SongDB.getInstance()
    }

    return Analyzer.instance
  }

  public async getPlotData (): Promise<number[][]> {
    const ret: number[][] = []
    const songDb = await SongDB.getInstance()

    for (const songNo in this.data) {
      const song = songDb.getSongData(songNo)
      if (song === undefined) continue

      for (const diff in this.data[songNo]) {
        const df = diff as DifficultyType

        if (song.courses[df].level === 9 && this.data[songNo][df] < 5) {
          console.log(songNo, df)
        }
        ret.push([
          song.courses[df].level,
          this.data[songNo][df]
        ])
      }
    }

    const minMax: number[][] = []
    for (let i = 0; i <= 10; i++) minMax.push([1e9, -1e9])
    for (const r of ret) {
      const level = r[0]
      const constant = r[1]
      minMax[level][0] = Math.min(minMax[level][0], constant)
      minMax[level][1] = Math.max(minMax[level][1], constant)
    }

    console.log(minMax)

    return ret
  }

  private async loadSongData (): Promise<void> {
    data.forEach(d => {
      const songNo = d.songno.toString()
      const diff = d.diff as DifficultyType
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      this.data[songNo] = this.data[songNo] || {}
      this.data[songNo][diff] = d.constant
    })
  }

  getLevelWidthSub (songNo: string, diff: DifficultyType): number {
    const originalLevel = Analyzer.songDB.getSongData(songNo)?.courses[diff]?.level ?? 0
    if (originalLevel === 0) return originalLevel

    const ranges = [
      [1, 1.806], // 1 ~ 5
      [1.603, 2.909], // 6
      [2.807, 4.41], // 7
      [4.301, 6.406], // 8
      [6.200, 8.009], // 9
      [7.714, 11.004] // 10
    ]

    let range = [0, 1]
    if (originalLevel < 6) range = ranges[0]
    else if (originalLevel === 6) range = ranges[1]
    else if (originalLevel === 7) range = ranges[2]
    else if (originalLevel === 8) range = ranges[3]
    else if (originalLevel === 9) range = ranges[4]
    else if (originalLevel === 10) range = ranges[5]

    let c = this.getSongConstant(songNo, diff)
    // clamp
    c = Math.max(range[0], Math.min(range[1], c))
    // scale to [0, 1]
    c = (c - range[0]) / (range[1] - range[0])
    c = Math.floor(c * 9.99) / 10

    return originalLevel + c
  }

  getSongConstant (songNo: string, diff: DifficultyType): number {
    return this.data?.[songNo]?.[diff] ?? 0
  }
}
