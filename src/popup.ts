import PopupMain from './popup/Main.svelte'

const root = document.getElementById('root')
if (root !== null) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const popupMain = new PopupMain({
    target: root
  })
}
