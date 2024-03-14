import type { Meta, StoryObj } from '@storybook/svelte'

import Switch from '../../components/Common/Switch.svelte'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Common/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    label: { control: 'text' }
  }
} satisfies Meta<Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Case1: Story = {
  args: {
    checked: false,
    label: 'Switch'
  }
}

export const Case2: Story = {
  args: {
    checked: true,
    label: 'Hello world'
  }
}
