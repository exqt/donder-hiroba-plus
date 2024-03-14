import { parseDonderInfo, updateDonderInfo } from '../lib/donder'

export default async (): Promise<void> => {
  const target = document.querySelector('#mydon_area')
  if (target === null) return

  const donderInfo = parseDonderInfo()
  await updateDonderInfo(donderInfo)
}
