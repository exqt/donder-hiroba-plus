import { SettingsStorage } from './settings'
import { images } from '../assets'
import type { BadgeType, DonderInfo } from '../types'
import type { Difficulty } from 'node-hiroba/types'

export const parseDonderInfo = (doc?: Document): DonderInfo => {
  doc ??= document
  const mydon = document.querySelector('#mydon_area')
  if (mydon === null) return {}

  const donderIdElem = mydon.querySelector('.detail')?.querySelectorAll('p')?.[1].textContent?.trim()
  const id = donderIdElem?.match(/(\d+)/)?.at(0)

  const title = mydon.children[1]?.innerHTML.trim()
  const name = mydon.children[2]?.textContent?.trim()

  const totalScore = mydon.querySelector('.total_score')
  const panelImage = totalScore?.querySelector('img')

  // <img src="image/sp/640/total_score_image_5.png" style="width: 100%;">
  // parse score image id
  const imageSrc = panelImage?.src
  const imageId = imageSrc?.match(/total_score_image_(\d+)\.png/)?.at(1)

  let diff: Difficulty = 'oni'
  if (imageId === '1') diff = 'easy'
  else if (imageId === '2') diff = 'normal'
  else if (imageId === '3') diff = 'hard'
  else diff = 'oni'

  const silver = parseInt(mydon.querySelector('.silver_crown_count')?.textContent?.trim() ?? '0') ?? '0'
  const gold = parseInt(mydon.querySelector('.gold_crown_count')?.textContent?.trim() ?? '0') ?? '0'
  const donderfull = parseInt(mydon.querySelector('.donderful_crown_count')?.textContent?.trim() ?? '0') ?? '0'
  const badgeCounts: Partial<Record<BadgeType, number>> = {}

  for (const cnt of totalScore?.querySelectorAll('div') ?? []) {
    // find class best_rank_score_[id]
    const rank = cnt.className.match(/best_rank_score_(\d+)/)
    if (rank === null) continue
    const rankId = parseInt(rank[1]) as BadgeType
    badgeCounts[rankId] = parseInt(cnt?.textContent?.trim() ?? '0') ?? '0'
  }

  return {
    id,
    name,
    title,
    preferredDifficulty: diff,
    crownCounts: {
      silver,
      gold,
      donderfull
    },
    badgeCounts
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
