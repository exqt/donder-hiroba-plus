import { SettingsStorage } from './settings'
import { images } from '../assets'
import type { DonderInfo } from '../types'

export const parseDonderInfo = (): DonderInfo => {
  const mydon = document.querySelector('#mydon_area')
  if (mydon === null) return {}

  const donderIdElem = mydon.querySelector('.detail')?.querySelectorAll('p')?.[1].textContent?.trim()
  const id = donderIdElem?.match(/(\d+)/)?.at(0)

  const title = mydon.children[1]?.innerHTML.trim()
  const name = mydon.children[2]?.textContent?.trim()

  return {
    id,
    name,
    title
  }
}

export const getDonderAvatarURL = (donderId: string | undefined): string => {
  if (donderId === undefined) return images.mydonPlaceholderImage
  return `https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_${donderId}`
}

export const getDanImageURL = (donderId: string | undefined): string => {
  if (donderId === undefined) return images.danPlaceholderImage
  return `https://donderhiroba.jp/imgsrc_danlabel.php?taiko_no=${donderId}`
}

export const updateDonderInfo = async (donderInfo: DonderInfo): Promise<void> => {
  if (donderInfo.id === undefined) return

  const settings = await SettingsStorage.getInstance()

  // if donderId is changed, reset storage
  if (settings.donderInfo?.id !== donderInfo.id) {
    await settings.reset()
  }

  settings.donderInfo = donderInfo
  await settings.save()
}
