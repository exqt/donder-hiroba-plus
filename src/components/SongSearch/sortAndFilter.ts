import { DIFFICULTIES } from '../../constants'
import type { Analyzer } from '../../lib/analyzer'
import { type SettingsStorage } from '../../lib/settings'
import type { SongDB } from '../../lib/songDB'
import type { DifficultyType, SearchOptions, SongScore, SortOptions } from '../../types'
import * as Hangul from 'hangul-js'

export const sortAndFilter = (
  searchOptions: SearchOptions,
  sortOptions: SortOptions,
  searchDifficulties: Record<DifficultyType, boolean>,
  songDB: SongDB,
  analyzer: Analyzer,
  settings: SettingsStorage,
  scores: SongScore[],
  excludeNoSongData: boolean
): SongScore[] => {
  const language = settings.language

  const filtered = scores.filter((score) => {
    const songData = songDB.getSongData(score.songNo)
    if (excludeNoSongData && songData === undefined) return false

    const needle = searchOptions.text.toLowerCase()
    const searcher = new Hangul.Searcher(needle)

    if (searchOptions.text !== '') {
      let haystack = score.title.toLowerCase()
      if (songData !== undefined) {
        if (language === 'ko') {
          if (songData.titleKo !== undefined && songData.titleKo !== null) {
            haystack += songData.titleKo?.toLowerCase()
          }
          if (songData.aliasKo !== undefined && songData.aliasKo !== null) {
            haystack += songData.aliasKo.toLowerCase()
          }
        }

        if (songData.titleEn !== undefined && songData.titleEn !== null) {
          haystack += songData.titleEn.toLowerCase()
        }

        if (songData.artists !== undefined) haystack += songData.artists.join('').toLowerCase()
      }

      if (language === 'ko') {
        if (searcher.search(haystack) === -1) return false
      } else {
        if (!haystack.includes(needle)) return false
      }
    }

    const filterDiffs: DifficultyType[] = []
    for (const diff of DIFFICULTIES) {
      if (searchDifficulties[diff]) filterDiffs.push(diff)
    }

    return filterDiffs.some((diff) => {
      const detail = score.details[diff]
      if (detail === undefined) return false
      if (!(searchOptions.crown[detail.crown] && searchOptions.badge[detail.badge])) return false

      const songData = songDB.getSongData(score.songNo)
      if (songData === undefined) return true

      const level = analyzer.getLevelWidthSub(score.songNo, diff)
      if (level === undefined) return true

      let minLevel = searchOptions.minLevel
      const maxLevel = searchOptions.maxLevel
      if (minLevel === 60) minLevel = -100
      if (!(minLevel <= level * 10 && level * 10 <= maxLevel)) return false

      return true
    })
  })

  filtered.sort((a, b) => {
    let ret = 0
    const offset = (sortOptions.inc ? 100 : -100)

    const aSongData = songDB.getSongData(a.songNo)
    const bSongData = songDB.getSongData(b.songNo)

    if (sortOptions.key === 'easy') {
      const aLevel = aSongData?.courses.easy.level ?? 0
      const bLevel = bSongData?.courses.easy.level ?? 0
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'normal') {
      const aLevel = aSongData?.courses.normal.level ?? 0
      const bLevel = bSongData?.courses.normal.level ?? 0
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'hard') {
      const aLevel = aSongData?.courses.hard.level ?? 0
      const bLevel = bSongData?.courses.hard.level ?? 0
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'oni') {
      const aLevel = aSongData !== undefined ? analyzer.getLevelWidthSub(aSongData.songNo, 'oni') : 0
      const bLevel = bSongData !== undefined ? analyzer.getLevelWidthSub(bSongData.songNo, 'oni') : 0
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'ura') {
      let aLevel = aSongData !== undefined ? analyzer.getLevelWidthSub(aSongData.songNo, 'oni_ura') : 0
      let bLevel = bSongData !== undefined ? analyzer.getLevelWidthSub(bSongData.songNo, 'oni_ura') : 0
      if (aLevel === 0) aLevel = offset
      if (bLevel === 0) bLevel = offset
      if (a.details?.oni_ura === undefined) aLevel += offset
      if (b.details?.oni_ura === undefined) bLevel += offset
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'alphabet') {
      ret = a.title.localeCompare(b.title, language)
    } else if (sortOptions.key === 'length') {
      ret = (aSongData?.courses?.oni?.playTime ?? 0) - (bSongData?.courses?.oni?.playTime ?? 0)
    } else if (sortOptions.key === 'bpm') {
      ret = (aSongData?.bpm.max ?? 0) - (bSongData?.bpm.min ?? 0)
    }

    return ret * (sortOptions.inc ? 1 : -1)
  })

  return filtered
}
