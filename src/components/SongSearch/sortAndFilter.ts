import { DIFFICULTIES } from '../../constants'
import { getDonforceLevel } from '../../lib/donforce'
import { type SettingsStorage } from '../../lib/settings'
import type { SongDB } from '../../lib/songDB'
import type { DifficultyType, SearchOptions, SongScore, SortOptions } from '../../types'
import * as Hangul from 'hangul-js'

export const sortAndFilter = (
  searchOptions: SearchOptions,
  sortOptions: SortOptions,
  searchDifficulties: Record<DifficultyType, boolean>,
  songDB: SongDB,
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
          haystack += songData.title_kr_user.toLowerCase()
        }
        haystack += songData.composer.toLowerCase()
        haystack += songData.artist.toLowerCase()
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

      const level = getDonforceLevel(songData, diff)
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
      const aLevel = aSongData?.levels.easy ?? 0
      const bLevel = bSongData?.levels.easy ?? 0
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'normal') {
      const aLevel = aSongData?.levels.normal ?? 0
      const bLevel = bSongData?.levels.normal ?? 0
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'hard') {
      const aLevel = aSongData?.levels.hard ?? 0
      const bLevel = bSongData?.levels.hard ?? 0
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'oni') {
      const aLevel = getDonforceLevel(aSongData, 'oni')
      const bLevel = getDonforceLevel(bSongData, 'oni')
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'ura') {
      let aLevel = getDonforceLevel(aSongData, 'oni_ura')
      let bLevel = getDonforceLevel(bSongData, 'oni_ura')
      if (aLevel === 0) aLevel = offset
      if (bLevel === 0) bLevel = offset
      if (a.details?.oni_ura === undefined) aLevel += offset
      if (b.details?.oni_ura === undefined) bLevel += offset
      ret = aLevel - bLevel
    } else if (sortOptions.key === 'alphabet') {
      ret = a.title.localeCompare(b.title, language)
    } else if (sortOptions.key === 'length') {
      ret = (aSongData?.length ?? 0) - (bSongData?.length ?? 0)
    } else if (sortOptions.key === 'bpm') {
      ret = (aSongData?.bpmMax ?? 0) - (bSongData?.bpmMax ?? 0)
    }

    return ret * (sortOptions.inc ? 1 : -1)
  })

  return filtered
}
