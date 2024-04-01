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
            crown: 'none'
          },
          hard: {
            badge: 1,
            crown: 'none'
          },
          normal: {
            badge: 1,
            crown: 'none'
          },
          oni: {
            badge: 1,
            crown: 'none'
          }
        },
        songNo: '397',
        title: 'STAGE 0.ac11'
      },
      {
        details: {
          easy: {
            badge: 1,
            crown: 'none'
          },
          hard: {
            badge: 1,
            crown: 'none'
          },
          normal: {
            badge: 1,
            crown: 'none'
          },
          oni: {
            badge: 6,
            crown: 'silver'
          },
          oni_ura: {
            badge: 6,
            crown: 'silver'
          }
        },
        songNo: '400',
        title: 'セイクリッド ルイン'
      }
    ]
  }
}
