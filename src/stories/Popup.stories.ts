import type { Meta, StoryObj } from '@storybook/svelte'
import PopupMain from '../popup/Main.svelte'

const meta = {
  title: 'PopupMain',
  component: PopupMain,
  tags: ['autodocs'],
  argTypes: {
    currentTabIdx: {
      control: { type: 'number' }
    }
  }
} satisfies Meta<PopupMain>

export default meta
type Story = StoryObj<typeof meta>

export const Profile: Story = {
  args: { currentTabIdx: 0 }
}

export const DonforceList: Story = {
  args: { currentTabIdx: 1 }
}

export const DonforceTable: Story = {
  args: { currentTabIdx: 2 }
}

export const Settings: Story = {
  args: { currentTabIdx: 3 }
}
