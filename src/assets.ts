import { processAssetPath } from './lib/utils'

import crownSilverIcon from './assets/icons/crown-silver.png'
import crownGoldIcon from './assets/icons/crown-gold.png'
import crownDonderfullIcon from './assets/icons/crown-donderfull.png'
import crownNoneIcon from './assets/icons/crown-none.png'

import badge0Icon from './assets/icons/badge-0.png'
import badge1Icon from './assets/icons/badge-1.png'
import badge2Icon from './assets/icons/badge-2.png'
import badge3Icon from './assets/icons/badge-3.png'
import badge4Icon from './assets/icons/badge-4.png'
import badge5Icon from './assets/icons/badge-5.png'
import badge6Icon from './assets/icons/badge-6.png'
import badge7Icon from './assets/icons/badge-7.png'
import badge8Icon from './assets/icons/badge-8.png'

import kantanIcon from './assets/icons/kantan.png'
import futsuuIcon from './assets/icons/futsuu.png'
import muzukashiiIcon from './assets/icons/muzukashii.png'
import oniIcon from './assets/icons/oni.png'
import uraIcon from './assets/icons/ura.png'

import quarterNoteIcon from './assets/icons/quarter-note.svg'
import hourglassIcon from './assets/icons/hourglass.png'
import arrowIcon from './assets/icons/arrow-right-solid.svg'
import alphabetIcon from './assets/icons/a-solid.svg'

import accountIcon from './assets/icons/account.svg'
import formatListNumberedIcon from './assets/icons/format-list-numbered.svg'
import cogIcon from './assets/icons/cog.svg'
import tableIcon from './assets/icons/table.svg'
import informationCircleIcon from './assets/icons/information-circle.svg'

import totalScorePanelKantanImage from './assets/images/total_score_image_1.png'
import totalScorePanelFutsuuImage from './assets/images/total_score_image_2.png'
import totalScorePanelMuzukashiiImage from './assets/images/total_score_image_3.png'
import totalScorePanelOniImage from './assets/images/total_score_image_5.png'

import mydonPlaceholderImage from './assets/images/mydon_placeholder.png'
import titlePlate from './assets/images/titleplate.png'
import danPlaceholderImage from './assets/images/dan_placeholder.png'

import githubMarkIcon from './assets/icons/github-mark.svg'

export const icons = {
  kantan: processAssetPath(kantanIcon),
  futsuu: processAssetPath(futsuuIcon),
  muzukashii: processAssetPath(muzukashiiIcon),
  oni: processAssetPath(oniIcon),
  ura: processAssetPath(uraIcon),

  quarterNote: processAssetPath(quarterNoteIcon),
  hourglass: processAssetPath(hourglassIcon),
  arrow: processAssetPath(arrowIcon),
  alphabet: processAssetPath(alphabetIcon),
  informationCircle: processAssetPath(informationCircleIcon),

  account: processAssetPath(accountIcon),
  formatListNumbered: processAssetPath(formatListNumberedIcon),
  cog: processAssetPath(cogIcon),
  table: processAssetPath(tableIcon),

  crowns: {
    none: processAssetPath(crownNoneIcon),
    silver: processAssetPath(crownSilverIcon),
    gold: processAssetPath(crownGoldIcon),
    donderfull: processAssetPath(crownDonderfullIcon)
  },

  github: processAssetPath(githubMarkIcon),

  badges: {
    0: processAssetPath(badge0Icon),
    1: processAssetPath(badge1Icon),
    2: processAssetPath(badge2Icon),
    3: processAssetPath(badge3Icon),
    4: processAssetPath(badge4Icon),
    5: processAssetPath(badge5Icon),
    6: processAssetPath(badge6Icon),
    7: processAssetPath(badge7Icon),
    8: processAssetPath(badge8Icon)
  }
}

export const images = {
  totalScorePanelKantanImage: processAssetPath(totalScorePanelKantanImage),
  totalScorePanelFutsuuImage: processAssetPath(totalScorePanelFutsuuImage),
  totalScorePanelMuzukashiiImage: processAssetPath(totalScorePanelMuzukashiiImage),
  totalScorePanelOniImage: processAssetPath(totalScorePanelOniImage),
  mydonPlaceholderImage: processAssetPath(mydonPlaceholderImage),
  titlePlate: processAssetPath(titlePlate),
  danPlaceholderImage: processAssetPath(danPlaceholderImage)
}
