import { DIFFICULTIES } from '../constants'
import { type BadgeType, type CrownType, type DifficultyType, type SongScore, type SongScoreDetail } from '../types'

export const parseScores = (doc?: Document): SongScore[] => {
  const scores: SongScore[] = []
  const scoresByNo: Record<string, SongScore> = {}

  doc = doc ?? document

  doc.querySelectorAll('.contentBox').forEach((elem) => {
    const nameElem = elem.querySelector('.songName')
    if (nameElem === null) return
    if (nameElem.textContent === null) return

    const title = nameElem.textContent.trim()

    // check if buttonList
    const buttonList = elem.querySelector('.buttonList')
    if (buttonList === null) return

    const scoreLinkElements = buttonList.querySelectorAll('a')
    const details: Partial<Record<DifficultyType, SongScoreDetail>> = {}

    scoreLinkElements.forEach((linkElem, index) => {
      const imageElem = linkElem.querySelector('.crown')
      if (imageElem === null) return

      const imageElemClasses = Array.from(imageElem?.classList)
      const diff = DIFFICULTIES.find((diff) => {
        for (const className of imageElemClasses) {
          if (className.includes(diff)) return true
        }
        return false
      })

      if (diff === undefined || !DIFFICULTIES.includes(diff)) return

      // ex ) image/sp/640/crown_button_silver_4_640.png
      const src = (imageElem as HTMLImageElement).src
      const fileName = src.split('/').slice(-1)[0]
      const regex = /crown_button_(\w+)_(\d+)_640/
      const match = regex.exec(fileName)

      let crown: CrownType = 'none'
      let badge: BadgeType = 1

      if (match !== null) {
        if (match[1] === 'played') crown = 'none'
        else crown = match[1] as CrownType
        badge = parseInt(match[2]) as BadgeType
      }

      const scoreDetail: SongScoreDetail = {
        crown: crown as CrownType,
        badge: badge as BadgeType
      }

      const isUra = scoreLinkElements.length === 1
      details[isUra ? 'oni_ura' : DIFFICULTIES[index]] = scoreDetail
    })

    // https://donderhiroba.jp/score_detail.php?song_no=1257&level=4&genre=6
    const songNo = /song_no=(\d+)/.exec(scoreLinkElements[0].href)?.[1]
    if (songNo === undefined) return

    if (scoresByNo[songNo] === undefined) {
      scores.push({ title, songNo, details })
      scoresByNo[songNo] = scores[scores.length - 1]
    } else {
      scoresByNo[songNo].details = { ...scoresByNo[songNo].details, ...details }
    }
  })

  return scores
}

export const clearSongElements = (): void => {
  const songs = document.querySelector('#songList > div')
  if (songs === null) return
  songs.replaceChildren()
}

export const getSongDetailLink = (songNo: string, diff: DifficultyType, taikoNo?: string): string => {
  const diffIndex = DIFFICULTIES.indexOf(diff) + 1
  let s = `https://donderhiroba.jp/score_detail.php?song_no=${songNo}&level=${diffIndex}`
  if (taikoNo !== undefined) s += `&taiko_no=${taikoNo}`
  return s
}
