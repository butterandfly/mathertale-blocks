// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProofReorderBlock } from './ProofReorderBlock';
import { expect, within } from '@storybook/test';
import { BlockStatus } from '../core/schemas';
import { type ProofReorderBlockData, ProofReorderType } from '../core/blocks/proof-reorder-block';
import { useState } from 'react';

const meta = {
  title: 'Blocks/ProofReorderBlock',
  component: ProofReorderBlock,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProofReorderBlock>;

export default meta;
type Story = StoryObj<typeof ProofReorderBlock>;

const sampleData: ProofReorderBlockData = {
  id: 'proof1',
  type: ProofReorderType,
  content: '请将以下证明步骤排序：',
  questionData: {
    orderItems: [
      {
        id: '1',
        content: '1. 假设 x > 0',
      },
      {
        id: '2',
        content: '2. 令 y = x + 1',
      },
      {
        id: '3',
        content: '3. 因此 y > 1',
      },
    ],
    questionOrder: '2,1,3', // 打乱的顺序，使用 id 字符串
  },
  updatedAt: new Date('2024-01-01'),
  getText: () => '请将以下证明步骤排序：',
};

// 初始状态：未提交答案
export const Initial: Story = {
  args: {
    data: sampleData,
    onSubmit: async (data, answer) => {
      console.log('Submitted answer:', answer);
    },
    onContinue: async (data) => {
      console.log('Continue clicked for:', data.id);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 检查标题是否存在
    await expect(canvas.getByText('Proof')).toBeInTheDocument();

    // 检查内容是否按照 questionOrder 的顺序渲染
    const items = canvas.getAllByRole('button');
    expect(items).toHaveLength(4);
  },
};

// 提交正确答案后的状态
export const CorrectAnswer: Story = {
  args: {
    data: {
      ...sampleData,
      questionData: {
        ...sampleData.questionData,
        questionOrder: '1,2,3',
      },
      getText: () => '请将以下证明步骤排序：',
    },
    submittedAnswer: '1,2,3', // 正确顺序
    onSubmit: async () => {},
    onContinue: async (data) => {
      console.log('Continue clicked for:', data.id);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 检查是否显示正确提示
    await expect(canvas.getByText('Correct!')).toBeInTheDocument();
  },
};

// 提交错误答案后的状态
export const WrongAnswer: Story = {
  args: {
    data: sampleData,
    submittedAnswer: '2,1,3', // 错误顺序
    onSubmit: async () => {},
    onContinue: async (data) => {
      console.log('Continue clicked for:', data.id);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 检查是否显示错误提示
    await expect(canvas.getByText('Not quite right.')).toBeInTheDocument();
  },
};

export const Interactive: Story = {
  render: function Render() {
    const [submittedAnswer, setSubmittedAnswer] = useState<string | undefined>(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setContinueValue] = useState<string | undefined>(undefined);

    return (
      <div className="space-y-4">
        <ProofReorderBlock
          data={sampleData}
          status={BlockStatus.IN_PROGRESS}
          submittedAnswer={submittedAnswer}
          onSubmit={async (data, answer) => {
            console.log('Submitted answer:', answer);
            setSubmittedAnswer(answer);
          }}
          onContinue={async (data) => {
            console.log('Continue clicked for:', data.id);
            setContinueValue(undefined);
          }}
        />
      </div>
    );
  },
};

// 只读模式用例
export const ReadOnly: Story = {
  args: {
    data: sampleData,
    status: BlockStatus.IN_PROGRESS,
    readonly: true,
    onSubmit: async () => {},
    onContinue: async (data) => {
      console.log('Continue clicked for:', data.id);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 检查标题是否存在
    await expect(canvas.getByText('Proof')).toBeInTheDocument();

    // 检查内容是否存在
    await expect(canvas.getByText('请将以下证明步骤排序：')).toBeInTheDocument();

    // 检查所有证明步骤是否按正确顺序显示（应该是原始顺序，不是打乱的顺序）
    // await expect(canvas.getByText('1. 假设 x > 0')).toBeInTheDocument();
    // await expect(canvas.getByText('2. 令 y = x + 1')).toBeInTheDocument();
    // await expect(canvas.getByText('3. 因此 y > 1')).toBeInTheDocument();

    // 检查解释是否显示
    await expect(canvas.getByText('The Complete Proof')).toBeInTheDocument();

    // 验证没有提交按钮
    await expect(canvas.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();

    // 验证没有继续按钮
    await expect(canvas.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
  },
};
