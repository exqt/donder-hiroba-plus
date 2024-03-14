import type { Meta, StoryObj } from '@storybook/svelte'

import SongSearch__SvelteComponent_ from '../components/SongSearch/SongSearch.svelte'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Search',
  component: SongSearch__SvelteComponent_,
  tags: ['autodocs'],
  argTypes: {
    scores: {
      control: 'object'
    }
  }
} satisfies Meta<SongSearch__SvelteComponent_>

export default meta
type Story = StoryObj<typeof meta>

export const Case1: Story = {
  args: {
    scores: [
      {
        details: {
          easy: {
            badge: 1,
            crown: 'none',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=397&level=1&genre=6'
          },
          hard: {
            badge: 1,
            crown: 'none',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=397&level=3&genre=6'
          },
          normal: {
            badge: 1,
            crown: 'none',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=397&level=2&genre=6'
          },
          oni: {
            badge: 1,
            crown: 'none',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=397&level=4&genre=6'
          }
        },
        songNo: '397',
        title: 'STAGE 0.ac11'
      },
      {
        details: {
          easy: {
            badge: 1,
            crown: 'none',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=400&level=1&genre=6'
          },
          hard: {
            badge: 1,
            crown: 'none',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=400&level=3&genre=6'
          },
          normal: {
            badge: 1,
            crown: 'none',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=400&level=2&genre=6'
          },
          oni: {
            badge: 6,
            crown: 'silver',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=400&level=4&genre=6'
          },
          oni_ura: {
            badge: 6,
            crown: 'silver',
            link: 'https://donderhiroba.jp/score_detail.php?song_no=400&level=5&genre=6'
          }
        },
        songNo: '400',
        title: 'セイクリッド ルイン'
      }
    ]
  }
}
