import mypage_top from './injections/mypage_top'
import score_list from './injections/score_list'
import index from './injections/index'
import favorite_song_select from './injections/favorite_song_select'
import diffchart from './injections/diffchart'
import score_detail from './injections/score_detail'
import select_song from './injections/select_song'
import i18n from './injections/i18n'
import dani from './injections/dani'
import hash, { hashChangeCallback } from './injections/hash'
import { isIOS } from '../src/lib/utils'
import { SettingsStorage } from './lib/settings'

const runHiroba = async (): Promise<void> => {
  window.addEventListener('hashchange', hashChangeCallback)

  const path = window.location.href.split('/').slice(3).join('/')
  const page = path.split('?')[0]

  await i18n()

  type Script = () => Promise<void>
  const scriptMap: Record<string, Script> = {
    'mypage_top.php': mypage_top,
    'score_list.php': score_list,
    '': index,
    'index.php': index,
    'favorite_song_select.php': favorite_song_select,
    'score_detail.php': score_detail,
    'select_song.php': select_song,
    'dan_detail.php': dani
  }

  if (page.startsWith('#')) {
    await hash()
    return
  }
  await scriptMap[page]?.()
}

const runTaikoWiki = async (): Promise<void> => {
  void diffchart()
}

const run = async (): Promise<void> => {
  if (isIOS()) return

  const settings = await SettingsStorage.getInstance()
  if (!settings.disclaimerAgreed) return

  if (window.location.href.includes('taiko.wiki')) {
    void runTaikoWiki()
  } else {
    void runHiroba()
  }
}

void run()
