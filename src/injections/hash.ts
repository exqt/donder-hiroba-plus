import HashRouter from '../components/Hash/HashRouter.svelte'

export default async function hash (): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const container = document.querySelector('#container') as HTMLElement | null
  if (container === null) {
    return
  }

  container.innerHTML = ''
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.alignItems = 'center'

  document.querySelector('img')?.remove()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = new HashRouter({
    target: container
  })
}

export function hashChangeCallback (event: HashChangeEvent): void {
  const oldURL = new URL(event.oldURL)
  const newURL = new URL(event.newURL)

  if (oldURL.hash === '' && newURL.hash !== '') {
    window.location.reload()
  }
  if (oldURL.hash !== '' && newURL.hash === '') {
    window.location.reload()
  }
}
