import type { Meta, StoryObj } from '@storybook/react';
import { SubmitControl } from './SubmitControl';
import { expect, within } from '@storybook/test';
import { userEvent } from '@storybook/test';

const meta = {
  title: 'Blocks/SubmitControl',
  component: SubmitControl,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SubmitControl>;

export default meta;
type Story = StoryObj<typeof SubmitControl>;

// 初始状态：显示提交按钮
export const Initial: Story = {
  args: {
    isSubmitEnabled: true,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeInTheDocument();
  },
};

// 正确答案状态
export const CorrectAnswer: Story = {
  args: {
    isSubmitted: true,
    isCorrect: true,
    explanation: '这是一个解释说明。\n\n包含 **Markdown** 格式。',
    onSubmit: async () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 检查是否显示正确提示
    await expect(canvas.getByText('Correct!')).toBeInTheDocument();

    // 点击显示解释
    const showExplanationButton = canvas.getByRole('button', { name: /show explanation/i });
    await userEvent.click(showExplanationButton);

    // 检查解释内容是否显示
    await expect(canvas.getByText('Explanation')).toBeInTheDocument();
  },
};

// 错误答案状态
export const WrongAnswer: Story = {
  args: {
    isSubmitted: true,
    isCorrect: false,
    explanation: '正确答案是 A。\n\n因为...',
    onSubmit: async () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Not quite right.')).toBeInTheDocument();
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    isSubmitEnabled: false,
    onSubmit: async () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeDisabled();
  },
};

// Loading
export const Loading: Story = {
  args: {
    isSubmitEnabled: true,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    await expect(canvas.getByText('Submitting...')).toBeInTheDocument();
  },
};

export const NoExplanation: Story = {
  args: {
    isSubmitted: true,
    isCorrect: true,
    onSubmit: async () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Explanation')).not.toBeInTheDocument();
  },
};
