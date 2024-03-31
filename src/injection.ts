import mypage_top from './injections/mypage_top'
import score_list from './injections/score_list'
import index from './injections/index'
import favorite_song_select from './injections/favorite_song_select'
import diffchart from './injections/diffchart'
import score_detail from './injections/score_detail'
import select_song from './injections/select_song'

const runHiroba = async (): Promise<void> => {
  const path = window.location.href.split('/').slice(3).join('/')
  const page = path.split('?')[0]

  type Script = () => Promise<void>
  const scriptMap: Record<string, Script> = {
    'mypage_top.php': mypage_top,
    'score_list.php': score_list,
    'index.php': index,
    'favorite_song_select.php': favorite_song_select,
    'score_detail.php': score_detail,
    'select_song.php': select_song
  }

  await scriptMap[page]?.()
}

const runTaikoWiki = async (): Promise<void> => {
  void diffchart()
}

if (window.location.href.includes('taikowiki.com')) {
  void runTaikoWiki()
} else {
  void runHiroba()
}
