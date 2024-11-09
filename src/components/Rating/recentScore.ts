import { load } from 'cheerio'
import * as cheerio from 'cheerio'
import type { Difficulty, DifficultyScoreData, Crown, Badge } from './ratingTypes'

const CROWN_MAP: Record<string, Crown> = {
  '01': 'played',
  '03': 'silver',
  '02': 'gold',
  '04': 'donderfull'
}

const getCrown = (src: string | undefined): Crown | null => {
  return src !== undefined ? CROWN_MAP[src] ?? null : null
}

const BADGE_MAP: Record<string, Badge> = {
  8: 'rainbow',
  7: 'purple',
  6: 'pink',
  5: 'gold',
  4: 'silver',
  3: 'bronze',
  2: 'white'
}

const getBadge = (element: any): Badge | null => {
  if (element === undefined || element == null || element.length === 0) return null
  const badgeId = element.attr('src')?.replace('image/sp/640/best_score_rank_', '').replace('_640.png', '')
  return BADGE_MAP[badgeId] ?? null
}

const diffCodeToDifficulty = (code: string): Difficulty => {
  if (code === '5') return 'ura'
  if (code === '4') return 'oni'
  if (code === '3') return 'hard'
  if (code === '2') return 'normal'
  return 'easy'
}

export interface RecentScoreData {
  songName: string
  difficulty: Difficulty
  scoreData: DifficultyScoreData
}

function parseDifficultyScoreData (body: any): RecentScoreData | null {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const $ = load(body)

  const songName = $('.songNameTitleScore h2').text().trim()

  const diffCode = $('.levelIcon').first().attr('src')?.match(/icon_course02_(\d+)_640\.png/)?.[1]
  const difficulty = diffCodeToDifficulty(diffCode ?? '1')
  const crownElements = $('.crownIcon')
  const crownCode = crownElements.first().attr('src')?.match(/crown_(\d+)_640\.png/)?.[1]
  const crown = getCrown(crownCode)
  const badge = getBadge(crownElements.eq(1))

  // 점수 파싱
  const score = parseInt($('.scoreScore').text().replace('点', ''), 10)

  // 상세 데이터 파싱
  const scoreDataElements = $('.scoreDataArea .playDataScore')

  const scoreData: DifficultyScoreData = {
    crown,
    badge,
    score,
    ranking: 0,
    good: parseInt(scoreDataElements.eq(0).text(), 10),
    maxCombo: parseInt(scoreDataElements.eq(1).text(), 10),
    ok: parseInt(scoreDataElements.eq(2).text(), 10),
    roll: parseInt(scoreDataElements.eq(3).text(), 10),
    bad: parseInt(scoreDataElements.eq(4).text(), 10),
    count: {
      play: parseInt(scoreDataElements.eq(5).text(), 10),
      clear: parseInt(scoreDataElements.eq(6).text(), 10),
      fullcombo: parseInt(scoreDataElements.eq(7).text(), 10),
      donderfullcombo: parseInt(scoreDataElements.eq(8).text(), 10)
    }
  }

  return {
    songName,
    difficulty,
    scoreData
  }
}

function parseScoreDataFromHtml (html: string): RecentScoreData[] {
  const $ = cheerio.load(html)
  const scoreElements = $('.scoreUser')

  return scoreElements.map((_, element) => parseDifficultyScoreData(element)).get()
}

export const getRecentScoreData = async (page: number): Promise<RecentScoreData[]> => {
  const url = `https://donderhiroba.jp/history_recent_score.php?page=${page}`
  const res = await fetch(url)
  const html = await res.text()
  return parseScoreDataFromHtml(html)
}
