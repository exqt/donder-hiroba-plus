import TrainingAnchor from '../components/Training/TrainingAnchor.svelte'
import { parseDonderInfo, updateDonderInfo } from '../lib/donder'

export default async (): Promise<void> => {
  putAnchorToTraining()
  const donderInfo = parseDonderInfo()
  await updateDonderInfo(donderInfo)
}

function putAnchorToTraining() {
  const mydonButtonArea = document.querySelector('.mydon_button_area') as HTMLElement | null
  if (!mydonButtonArea) return

  const container = document.createElement('div')
  mydonButtonArea.parentElement?.insertBefore(container, mydonButtonArea.nextElementSibling)

  const anchor = new TrainingAnchor({
    target: container
  })
}