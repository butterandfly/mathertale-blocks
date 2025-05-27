import type { Meta, StoryObj } from '@storybook/react';
import { SingleChoiceBlock } from './SingleChoiceBlock';
import { SingleChoiceType, type SingleChoiceBlockData } from '../core/blocks/single-choice-block';
import { BlockStatus } from '../core/schemas';
import { expect, userEvent, within } from '@storybook/test';

const meta = {
  title: 'Blocks/SingleChoiceBlock',
  component: SingleChoiceBlock,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SingleChoiceBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultData: SingleChoiceBlockData = {
  id: 'block-1',
  type: SingleChoiceType,
  content: 'Which of the following is **not** a property of a vector space?',
  questionData: {
    choices: [
      { key: 'A', content: 'Closure under addition' },
      { key: 'B', content: 'Existence of additive identity' },
      { key: 'C', content: 'Multiplication is commutative' },
      { key: 'D', content: 'Distributive property' },
    ],
    answer: 'C',
    explanation: 'Scalar multiplication is not required to be commutative in a vector space.',
  },
  updatedAt: new Date('2024-01-01'),
  getText: () => 'Which of the following is not a property of a vector space?',
};

// 基础用例
export const Default: Story = {
  args: {
    data: defaultData,
    status: BlockStatus.IN_PROGRESS,
    submittedAnswer: undefined,
    onSubmit: async (data, submittedAnswer) => {
      console.log('Submitted:', data.id, 'Answer:', submittedAnswer);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onContinue: async (data) => {
      console.log('Continue:', data.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

// 提交中的状态
export const Submitting: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 选择选项
    const optionC = canvas.getByLabelText('Multiplication is commutative', { exact: false });
    await userEvent.click(optionC);

    // 点击提交按钮
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // 验证加载状态
    await expect(submitButton).toHaveTextContent('Submitting...');
    await expect(submitButton).toBeDisabled();
  },
};

// 正确回答用例
export const CorrectAnswer: Story = {
  args: {
    ...Default.args,
    status: BlockStatus.IN_PROGRESS,
    submittedAnswer: 'C',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 验证正确状态显示
    await expect(canvas.getByText('🎉')).toBeInTheDocument();
    await expect(canvas.getByText('Correct!')).toBeInTheDocument();

    // 点击显示解释
    const explanationButton = canvas.getByText('Show Explanation');
    await userEvent.click(explanationButton);

    // 验证解释内容
    await expect(canvas.getByText('Scalar multiplication', { exact: false })).toBeInTheDocument();
  },
};

// 错误回答用例
export const WrongAnswer: Story = {
  args: {
    ...Default.args,
    status: BlockStatus.IN_PROGRESS,
    submittedAnswer: 'B',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 验证错误状态显示
    await expect(canvas.getByText('🤔')).toBeInTheDocument();
    await expect(canvas.getByText('Not quite right.')).toBeInTheDocument();

    // 验证错误选项样式
    const wrongOption = canvas.getByText('Existence of additive identity').closest('label');
    await expect(wrongOption).toHaveClass('bg-red-50');
  },
};

// 已完成状态用例
export const Completed: Story = {
  args: {
    ...Default.args,
    status: BlockStatus.COMPLETED,
    submittedAnswer: 'C',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 验证所有选项禁用
    const radios = canvas.getAllByRole('radio');
    await Promise.all(
      radios.map(async (radio) => {
        await expect(radio).toBeDisabled();
      }),
    );

    // 验证继续按钮消失
    await expect(canvas.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
  },
};

// 新增选中状态用例
export const ChoiceSelected: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 选择选项B（索引1）
    const optionB = canvas.getByLabelText('Existence of additive identity', { exact: false });
    await userEvent.click(optionB);

    // 验证选中样式
    const optionBLabel = canvas.getByText('Existence of additive identity').closest('label');
    await expect(optionBLabel).toHaveClass('border-gray-900');

    // 验证未选中的选项没有选中样式
    const optionALabel = canvas.getByText('Closure under addition').closest('label');
    await expect(optionALabel).not.toHaveClass('border-gray-900');

    // 验证提交按钮可用
    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await expect(submitButton).toBeEnabled();
  },
};

// 只读模式用例
export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readonly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 验证正确答案被高亮显示
    const correctOption = canvas.getByText('Multiplication is commutative').closest('label');
    await expect(correctOption).toHaveClass('bg-green-50', 'border-green-500');

    // 验证所有选项禁用
    const radios = canvas.getAllByRole('radio');
    await Promise.all(
      radios.map(async (radio) => {
        await expect(radio).toBeDisabled();
      }),
    );

    // 验证解释显示
    await expect(canvas.getByText('Explanation')).toBeInTheDocument();
    await expect(canvas.getByText('Scalar multiplication', { exact: false })).toBeInTheDocument();

    // 验证没有提交按钮
    await expect(canvas.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();

    // 验证没有继续按钮
    await expect(canvas.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
  },
};
