import { type PlaydataType } from '../types'
import BestScore from '../components/Dani/BestScore.svelte'
import { SongDB } from '../lib/songDB'

export default async function dani (): Promise<void> {
  if ((new URL(window.location.href)).pathname !== '/dan_detail.php') return

  const boxes = [...document.querySelectorAll('.contentBox:not(.errorArea)')]
  const songdata = await SongDB.getInstance()

  boxes.forEach((box) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bestscore = new BestScore({
      target: box,
      props: {
        playdata: (async () => {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
          const songTitle = (box.querySelector('.songName') as HTMLElement).innerText.trim()
          const songNo = songdata.getSongNoByTitle(songTitle)
          let difficulty = box.querySelector('img')?.src.replace(/https:\/\/donderhiroba.jp\/image\/sp\/640\/level_icon_(.)_640.png/, '$1')
          if (difficulty === 'https://donderhiroba.jp/image/sp/640/icon_ura_640.png') {
            difficulty = '5'
          }

          // db에 해당 곡명을 가진 곡에 대한 데이터가 없으면 종료
          if (songNo === undefined || difficulty === undefined) throw new Error()

          let response: string
          try {
            response = await (await fetch(`/score_detail.php?song_no=${songNo}&level=${difficulty}`)).text()
          } catch {
            // 요청에 문제가 생기면 종료
            throw new Error()
          }

          const dom = document.createElement('div')
          dom.innerHTML = response
          const scoreDetailTable = dom.querySelector('.scoreDetailTable')

          // scoreDetailTable이 없으면 종료
          if (scoreDetailTable === null) throw new Error()
          /*
                    한번도 플레이한 적이 없으면 종료
                    그냥 0으로 표시할거면 밑줄 지우세요
                    */
          if (dom.querySelector('.contentBox.errorArea') !== null) throw new Error()

          const playdata: PlaydataType = {
            /* eslint-disable */
            score: parseInt((dom.querySelector('div.high_score') as HTMLElement).innerText.trim().replace('点', '') as string),
            good: parseInt((dom.querySelector('div.good_cnt') as HTMLElement).innerText.trim().replace('回', '') as string),
            ok: parseInt((dom.querySelector('div.ok_cnt') as HTMLElement).innerText.trim().replace('回', '') as string),
            ng: parseInt((dom.querySelector('div.ng_cnt') as HTMLElement).innerText.trim().replace('回', '') as string),
            pound: parseInt((dom.querySelector('div.pound_cnt') as HTMLElement).innerText.trim().replace('回', '') as string),
            combo: parseInt((dom.querySelector('div.combo_cnt') as HTMLElement).innerText.trim().replace('回', '') as string),
            hit: 0
            /* eslint-enable */
          }

          playdata.hit = playdata.good + playdata.ok + playdata.pound

          return playdata
        })()
      }
    })
  })
}
