import ClosetBtn from '../components/Closet/Closet-btn.svelte'

export default async function (): Promise<void> {
  const target = document.querySelector('.favoriteArea.tmp')
  if (target === null) return
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = new ClosetBtn({
    target
  })
}
