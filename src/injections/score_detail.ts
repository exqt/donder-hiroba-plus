// https://donderhiroba.jp/score_detail.php?song_no=371&level=5&genre=6

import SongInfo from '../components/Song/SongInfo.svelte'
import { SongDB } from '../lib/songDB'

export default async (): Promise<void> => {
  // parse song_no, level, genre
  const songNo = /song_no=(\d+)/.exec(window.location.href)?.[1]
  // const level = /level=(\d+)/.exec(window.location.href)?.[1]
  // const genre = /genre=(\d+)/.exec(window.location.href)?.[1]

  if (songNo == null) return

  const titleElem = document.querySelector('.songNameTitleScore')
  if (titleElem == null) return

  const title = titleElem.textContent?.trim()
  if (title == null) return

  const content = document.querySelector('#content')
  const scoreDetail = document.querySelector('.scoreDetail')
  if (content == null) return
  if (scoreDetail == null) return

  const div = document.createElement('div')
  div.id = 'song-info'
  div.style.cssText = 'margin:0 auto;padding:5px 0px 0px 0px;width:300px;'
  content.insertBefore(div, scoreDetail)

  const songDB = await SongDB.getInstance()
  const songData = songDB.getSongData(songNo)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const songInfo = new SongInfo({
    target: div,
    props: {
      title,
      songNo,
      songData
    }
  })
}
