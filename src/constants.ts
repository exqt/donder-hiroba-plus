export const WIDTH = 300
export const HEIGHT = 540

export const DIFFICULTY_COLORS = [
  '#ff2703',
  '#8dae51',
  '#414b2b',
  '#db1885',
  '#7135db'
]

export const DIFFICULTIES = ['easy', 'normal', 'hard', 'oni', 'oni_ura'] as const
export const DIFFICULTY_TO_INDEX = Object.fromEntries(DIFFICULTIES.map((difficulty, index) => [difficulty, index]))

export const CROWNS = ['none', 'silver', 'gold', 'donderfull'] as const
export const BADGES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

export const GENRES = ['unknown', 'jpop', 'anime', 'kids', 'vocaloid', 'game', 'namco', 'variety', 'classic'] as const

export const DONFORCE_NUMBER_OF_RECORDS = 50
export const MAX_PLAYLIST_SONGS = 30
