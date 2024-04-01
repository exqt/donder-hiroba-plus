import type { Meta, StoryObj } from '@storybook/svelte'

import PlaylistEditor from '../components/Playlist/PlaylistEditor.svelte'
import type { FavoriteSong } from '../types'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Playlist',
  component: PlaylistEditor,
  tags: ['autodocs'],
  argTypes: {
    tckt: { control: 'text' },
    favoriteSongList: { control: 'object' }
  }
} satisfies Meta<PlaylistEditor>

export default meta
type Story = StoryObj<typeof meta>

const favoriteSongList = [
  {
    genre: 'variety',
    songNo: '1229',
    title: 'Chronomia'
  },
  {
    genre: 'game',
    songNo: '553',
    title: 'BLAZING VORTEX'
  },
  {
    genre: 'variety',
    songNo: '1220',
    title: 'Destr0yer'
  },
  {
    genre: 'namco',
    songNo: '1120',
    title: 'そして勇者は眠りにつく'
  },
  {
    genre: 'anime',
    songNo: '1116',
    title: 'ミックスナッツ'
  },
  {
    genre: 'jpop',
    songNo: '811',
    title: 'あなたとトゥラッタッタ♪'
  },
  {
    genre: 'namco',
    songNo: '243',
    title: '万戈イム－一ノ十'
  },
  {
    genre: 'variety',
    songNo: '845',
    title: 'Dreadnought'
  },
  {
    genre: 'game',
    songNo: '757',
    title: 'Xevel'
  },
  {
    genre: 'jpop',
    songNo: '1027',
    title: '夏祭り / ジッタリン・ジン'
  },
  {
    genre: 'namco',
    songNo: '869',
    title: '森羅万象'
  },
  {
    genre: 'game',
    songNo: '442',
    title: 'VERTeX'
  },
  {
    genre: 'variety',
    songNo: '456',
    title: 'INSPION'
  },
  {
    genre: 'namco',
    songNo: '815',
    title: 'ラヴ♡スパイス♡ライクユー!!!'
  },
  {
    genre: 'game',
    songNo: '294',
    title: 'PaPaPa Love'
  },
  {
    genre: 'namco',
    songNo: '993',
    title: '彁'
  },
  {
    genre: 'namco',
    songNo: '366',
    title: 'きみのあかり'
  },
  {
    genre: 'namco',
    songNo: '617',
    title: '風雲志士'
  },
  {
    genre: 'vocaloid',
    songNo: '574',
    title: 'SstTAarR*'
  },
  {
    genre: 'namco',
    songNo: '554',
    title: '黒船来航'
  },
  {
    genre: 'kids',
    songNo: '368',
    title: 'さんぽ'
  },
  {
    genre: 'namco',
    songNo: '1096',
    title: 'ねこくじら'
  },
  {
    genre: 'namco',
    songNo: '72',
    title: 'The Carnivorous Carnival'
  },
  {
    genre: 'namco',
    songNo: '38',
    title: '風のファンタジー'
  },
  {
    genre: 'classic',
    songNo: '84',
    title: 'カルメン 組曲一番終曲'
  },
  {
    genre: 'anime',
    songNo: '898',
    title: 'God knows..'
  },
  {
    genre: 'namco',
    songNo: '1122',
    title: '狂瀾怒濤'
  },
  {
    genre: 'vocaloid',
    songNo: '1012',
    title: '4+1のそれぞれの未来'
  }
] as FavoriteSong[]

export const Case1: Story = {
  args: {
    tckt: 'tckt',
    favoriteSongList
  }
}
