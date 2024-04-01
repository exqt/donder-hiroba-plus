import type { Meta, StoryObj } from '@storybook/svelte'

import Song__SvelteComponent_ from '../components/Song/Song.svelte'
import type { GenreType } from '../types'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Song',
  component: Song__SvelteComponent_,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    songData: { control: 'object' }
  }
} satisfies Meta<Song__SvelteComponent_>

export default meta
type Story = StoryObj<typeof meta>

const songData1 = {
  songNo: '1',
  title: 'てんぢく2000',
  title_kr_official: 'Tenjiku2000',
  title_kr_user: '텐지쿠2000',
  bpmMin: 180,
  bpmMax: 180,
  levels: {
    easy: 4,
    normal: 7,
    hard: 8,
    oni: 10,
    oni_ura: 0
  },
  genres: ['jpop'] as GenreType[],
  asia: true,
  length: 137.67,
  balloonCounts: {
    easy: 39,
    normal: 47,
    hard: 40,
    oni: 24,
    oni_ura: 0
  },
  drumrollLengths: {
    easy: 6.03,
    normal: 5.64,
    hard: 1.89,
    oni: 1.89,
    oni_ura: 0
  },
  composer: 'LindaAI-CUE',
  artist: 'LindaAI-CUE, ギンギツネ',
  noteCounts: {
    easy: 147,
    normal: 214,
    hard: 593,
    oni: 831,
    oni_ura: 0
  },
  dan: '12280204|14300304',
  chart: {
    oni: '010026100',
    oni_ura: ''
  }
}

export const Case1: Story = {
  args: {
    songNo: '1',
    title: 'てんぢく2000',
    genre: undefined,
    songData: songData1,
    details: {
      easy: { badge: 7, crown: 'gold' },
      normal: { badge: 6, crown: 'silver' },
      hard: { badge: 5, crown: 'donderfull' },
      oni: { badge: 6, crown: 'silver' }
    },
    translatedTitle: undefined,
    taikoNo: undefined,
    playlists: undefined
  }
}
