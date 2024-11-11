import { PlaylistsStore } from '../lib/playlist'
import PlaylistContextMenu from '../components/Common/PlaylistContextMenu.svelte'
import type { DifficultyType } from '../types'

const insertContextMenu = (playlistsStore: PlaylistsStore): () => void => {
  let comp: PlaylistContextMenu

  const removeContextMenu = (): void => {
    comp?.$destroy()
  }

  const contextMenuClick = (ev: Event): void => {
    removeContextMenu()

    const target = ev.target as HTMLElement
    const linkElem = target.closest('a')
    if (linkElem === null) return

    const songNo = linkElem.href.match(/\/(\d+)/)?.[1]
    if (songNo === undefined) return

    const titleElem = linkElem.querySelector('.title')
    if (titleElem === null) return
    const titleStyle = window.getComputedStyle(titleElem)
    const diff: DifficultyType = titleStyle.getPropertyValue('color') === 'rgb(148, 106, 222)' ? 'oni_ura' : 'oni'

    const mouseEvent = ev as MouseEvent
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    comp = new PlaylistContextMenu({
      target: document.body,
      props: {
        playlists: playlistsStore,
        difficulty: diff,
        songNo,
        x: mouseEvent.pageX,
        y: mouseEvent.pageY,
        wikiLink: linkElem.href
      }
    })

    ev.preventDefault()
  }

  // attach context menu
  const list = document.querySelectorAll('.container > .title-container')
  for (const item of list) {
    item.addEventListener('contextmenu', contextMenuClick)
  }

  document.body.addEventListener('click', removeContextMenu)

  return () => {
    for (const item of list) {
      item.removeEventListener('contextmenu', contextMenuClick)
    }
    document.body.removeEventListener('contextmenu', removeContextMenu)
  }
}

export default async (): Promise<void> => {
  const playlistsStore = await PlaylistsStore.getInstance()
  insertContextMenu(playlistsStore)
}
