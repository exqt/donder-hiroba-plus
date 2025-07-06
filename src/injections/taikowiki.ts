import { PlaylistsStore } from '../lib/playlist'
import PlaylistContextMenu from '../components/Common/PlaylistContextMenu.svelte'
import RecentScoreStorage from '../components/Rating/recentScoreStorage'
import type { Difficulty } from 'node-hiroba/types'

const insertContextMenu = (playlistsStore: PlaylistsStore, recentScoreStorage: RecentScoreStorage): void => {
  let comp: PlaylistContextMenu

  const removeContextMenu = (): void => {
    comp?.$destroy()
  }

  const contextMenuClick = (ev: Event): void => {
    removeContextMenu()

    const target = ev.target as HTMLElement
    const linkElem = target.closest('a')
    if (linkElem === null) return

    try {
      const url = new URL(linkElem.href)
      if (url.origin !== 'https://taiko.wiki' || !url.pathname.startsWith('/song/')) {
        return
      }

      const songNo = url.pathname.match(/\/song\/(\d+)/)?.[1]
      if (songNo === undefined) return

      const diffFromParam = url.searchParams.get('diff')
      let diff: Difficulty = 'oni'; // or another appropriate default value

      if (diffFromParam === 'ura' || diffFromParam === 'oni_ura') diff = 'ura'
      else if (diffFromParam === 'oni') diff = 'oni'
      else if (diffFromParam === 'hard') diff = 'hard'
      else if (diffFromParam === 'normal') diff = 'normal'
      else if (diffFromParam === 'easy') diff = 'easy'

      const mouseEvent = ev as MouseEvent
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      comp = new PlaylistContextMenu({
        target: document.body,
        props: {
          playlists: playlistsStore,
          recentScores: recentScoreStorage,
          difficulty: diff,
          songNo,
          x: mouseEvent.pageX,
          y: mouseEvent.pageY,
          wikiLink: linkElem.href
        }
      })

      ev.preventDefault()
    } catch (e) {
      // invalid url
    }
  }

  // attach context menu
  const links = document.querySelectorAll('a[href^="/song/"]')
  console.log(`Found ${links.length} song links to attach context menu.`)
  for (const link of links) {
    if (link.getAttribute('data-hiroba-extension') === '1') continue
    link.addEventListener('contextmenu', contextMenuClick)
    link.setAttribute('data-hiroba-extension', '1')
  }

  document.body.addEventListener('click', removeContextMenu)
}

export default async (): Promise<void> => {
  const playlistsStore = await PlaylistsStore.getInstance()
  const recentScoreStore = new RecentScoreStorage()
  await recentScoreStore.loadFromChromeStorage()

  const runInterval = () => {
    let executionCount = 0
    const intervalId = setInterval(() => {
      insertContextMenu(playlistsStore, recentScoreStore)
      executionCount++
      if (executionCount >= 5) {
        clearInterval(intervalId)
      }
    }, 1000)
  }

  runInterval()

  let lastUrl = location.href
  new MutationObserver(() => {
    const url = location.href
    if (url !== lastUrl) {
      lastUrl = url
      runInterval()
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  })
}
