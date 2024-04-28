import { ScoreStorage } from '../lib/scores'
import { icons } from '../assets'

const INTERVAL_TIME = 500

const addGlobalStyle = (css: string): void => {
  // check if already exists
  const existing = document.querySelector('style[title="hiroba-plus-global-style"]')
  if (existing !== null) return

  const head = document.getElementsByTagName('body')[0]
  if (head === undefined) return
  const style = document.createElement('style')
  style.title = 'hiroba-plus-global-style'
  style.innerHTML = css
  head.appendChild(style)
}

export default async (): Promise<void> => {
  addGlobalStyle(`
    .song { transition: background-color 0.3s; }
    .song .badge {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 22px;
      height: 22px;
    }
    .song.gold { background-color: #ffe972; }
    .song.silver { background-color: #d4e8ff; }
    .song.donderfull {
      background: linear-gradient(
        45deg,
        #ffb3ba,  /* pink */
        #ffdfba,  /* peach */
        #ffffba,  /* yellow */
        #baffc9,  /* mint */
        #bae1ff   /* light blue */
      );
    }
  `)

  const storage = await ScoreStorage.getInstance()

  setInterval(() => {
    const path = window.location.href.split('/').slice(3).join('/')
    if (!path.startsWith('diffchart')) return

    const titles = document.querySelectorAll('.title')

    // check if already processed
    let flag = false
    titles.forEach((title) => {
      const heading = title.querySelector('h1')
      if (heading === null) return

      if (heading.innerText.endsWith(')')) flag = true
    })

    if (flag) return

    titles.forEach((title) => {
      const heading = title.querySelector('h1')
      if (heading === null) return

      const wrapper = title.parentElement
      if (wrapper === null) return

      const songs = wrapper.querySelectorAll('.song')

      heading.innerText += ` (${songs.length})`

      songs.forEach((song) => {
        const title = song.querySelector('.name-jpn')
        if (title === null) return

        const titleColor = title.computedStyleMap().get('color')?.toString()
        if (titleColor === null) return

        const asAElement = song as HTMLAnchorElement

        // /song/{id}
        const id = asAElement.href.split('/').pop()
        if (id === undefined) return

        const scores = storage.getScoreByNo(id)

        const URA_COLOR = 'rgb(80, 42, 215)'
        const diff = titleColor === URA_COLOR ? 'oni_ura' : 'oni'

        const diffScore = scores?.details[diff]
        if (diffScore === undefined) return

        song.classList.add(diffScore.crown)

        // create badge image
        if (diffScore.badge > 1) {
          const badge = document.createElement('img')
          badge.src = icons.badges[diffScore.badge]
          badge.classList.add('badge')
          song.appendChild(badge)
        }
      })
    })
  }, INTERVAL_TIME)
}
