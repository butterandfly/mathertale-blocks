import type { Meta, StoryObj } from '@storybook/react';
import { BlockProgressControl } from './BlockProgressControl';
import { BlockStatus } from '../core/schemas';
import { userEvent, within } from '@storybook/test';
import { expect } from '@storybook/test';

const meta = {
  title: 'Blocks/BlockProgressControl',
  component: BlockProgressControl,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BlockProgressControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: {
    status: BlockStatus.IN_PROGRESS,
    onContinue: () => Promise.resolve(),
  },
};

export const Completed: Story = {
  args: {
    status: BlockStatus.COMPLETED,
    onContinue: () => Promise.resolve(),
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const WithError: Story = {
  args: {
    status: BlockStatus.IN_PROGRESS,
    onContinue: () => Promise.reject(new Error('Test error')),
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);

    // 检查错误信息是否显示
    const errorMessage = await canvas.findByText('Test error');
    await expect(errorMessage).toBeInTheDocument();

    // 检查按钮是否启用（不是 disabled）
    await expect(button).toBeEnabled();
  },
};

export const Loading: Story = {
  args: {
    status: BlockStatus.IN_PROGRESS,
    onContinue: () => new Promise((resolve) => setTimeout(resolve, 2000)),
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);

    // 检查加载状态
    const loadingText = await canvas.findByText('Loading...');
    await expect(loadingText).toBeInTheDocument();

    // 检查按钮是否禁用
    await expect(button).toBeDisabled();
  },
};
