// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ContradictionBlock } from './ContradictionBlock';
import { BlockStatus } from '../core/schemas';
import { expect, userEvent, within } from '@storybook/test';
import { type ContradictionBlockData, ContradictionType } from '../core/blocks/contradiction-block';

const meta = {
  title: 'Blocks/ContradictionBlock',
  component: ContradictionBlock,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContradictionBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultData: ContradictionBlockData = {
  id: 'block-1',
  type: ContradictionType,
  content: 'Drag the "facts" that contradict each other into the boxes.',
  questionData: {
    choices: [
      { key: 'A', content: 'All natural numbers are positive integers.' },
      { key: 'B', content: 'Zero is a natural number.' },
      { key: 'C', content: 'The sum of two natural numbers is always a natural number.' },
      { key: 'D', content: 'The product of two natural numbers is always a natural number.' },
    ],
    answer: ['A', 'B'],
    explanation: 'The statements "All natural numbers are positive integers" and "Zero is a natural number" contradict each other because zero is not a positive integer.',
  },
  updatedAt: new Date('2024-01-01'),
  getText: () => 'Drag the "facts" that contradict each other into the boxes.',
};

// 基础用例
export const Default: Story = {
  args: {
    data: defaultData,
    status: BlockStatus.IN_PROGRESS,
    onSubmit: async (data, submittedAnswer) => {
      console.log('Submitted:', data.id, 'Answer:', submittedAnswer);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onContinue: async (data) => {
      console.log('Continue:', data.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

// 正确回答用例
export const CorrectAnswer: Story = {
  args: {
    ...Default.args,
    submittedAnswer: 'A,B',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('验证正确状态显示', async () => {
      await expect(canvas.getByText('🎉')).toBeInTheDocument();
      await expect(canvas.getByText('Correct!')).toBeInTheDocument();
    });
    
    await step('点击显示解释', async () => {
      const explanationButton = canvas.getByText('Show Explanation');
      await userEvent.click(explanationButton);
    });
    
    await step('验证解释内容', async () => {
      await expect(canvas.getByText('The statements', { exact: false })).toBeInTheDocument();
    });
  },
};

// 错误回答用例
export const WrongAnswer: Story = {
  args: {
    ...Default.args,
    submittedAnswer: 'C,D',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('验证错误状态显示', async () => {
      await expect(canvas.getByText('🤔')).toBeInTheDocument();
      await expect(canvas.getByText('Not quite right.')).toBeInTheDocument();
    });
  },
};

// 已完成状态用例
export const Completed: Story = {
  args: {
    ...Default.args,
    status: BlockStatus.COMPLETED,
    submittedAnswer: 'A,B',
  },
};

// 数学矛盾的例子
export const MathContradiction: Story = {
  args: {
    data: {
      ...defaultData,
      content: '## Identify the Mathematical Contradiction\n\nDrag the statements that contradict each other into the boxes.',
      questionData: {
        choices: [
          { key: 'A', content: 'For all real numbers $x$, we have $x^2 \\geq 0$.' },
          { key: 'B', content: 'There exists a real number $x$ such that $x^2 < 0$.' },
          { key: 'C', content: 'The square root of a negative number is not a real number.' },
          { key: 'D', content: 'The equation $x^2 + 1 = 0$ has no real solutions.' },
        ],
        answer: ['A', 'B'],
        explanation: 'The statements "For all real numbers $x$, we have $x^2 \\geq 0$" and "There exists a real number $x$ such that $x^2 < 0$" directly contradict each other.',
      },
      getText: () => 'Identify the Mathematical Contradiction. Drag the statements that contradict each other into the boxes.',
    },
    status: BlockStatus.IN_PROGRESS,
    onSubmit: async (data, submittedAnswer) => {
      console.log('Submitted:', data.id, 'Answer:', submittedAnswer);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onContinue: async (data) => {
      console.log('Continue:', data.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

// 测试两个矛盾块在同一页面的隔离性
export const TwoContradictionBlocks: Story = {
  args: {
    ...Default.args,
  },
  render: () => {
    // 第一个矛盾块数据 - 简单的数学矛盾
    const data1: ContradictionBlockData = {
      id: 'block-1',
      type: ContradictionType,
      content: '## Block 1: Math Contradiction\n\nDrag the statements that contradict each other.',
      questionData: {
        choices: [
          { key: 'A', content: '2 + 2 = 4' },
          { key: 'B', content: '2 + 2 = 5' },
          { key: 'C', content: '3 × 3 = 9' },
        ],
        answer: ['A', 'B'],
        explanation: 'The statements "2 + 2 = 4" and "2 + 2 = 5" directly contradict each other.',
      },
      updatedAt: new Date('2024-01-01'),
      getText: () => 'Block 1: Math Contradiction. Drag the statements that contradict each other.',
    };

    // 第二个矛盾块数据 - 简单的逻辑矛盾
    const data2: ContradictionBlockData = {
      id: 'block-2',
      type: ContradictionType,
      content: '## Block 2: Logic Contradiction\n\nDrag the statements that contradict each other.',
      questionData: {
        choices: [
          { key: 'X', content: 'All birds can fly.' },
          { key: 'Y', content: 'Penguins are birds that cannot fly.' },
          { key: 'Z', content: 'Some birds build nests in trees.' },
        ],
        answer: ['X', 'Y'],
        explanation: 'The statements "All birds can fly" and "Penguins are birds that cannot fly" directly contradict each other.',
      },
      updatedAt: new Date('2024-01-01'),
      getText: () => 'Block 2: Logic Contradiction. Drag the statements that contradict each other.',
    };

    return (
      <div className="space-y-8 max-w-3xl">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-bold mb-4">Testing Isolation Between Contradiction Blocks</h2>
          <p className="mb-4">
            This story tests that two ContradictionBlocks on the same page are properly isolated.
            You should be able to drag items in each block independently without affecting the other block.
          </p>
        </div>
        
        <ContradictionBlock
          data={data1}
          status={BlockStatus.IN_PROGRESS}
          onSubmit={async (data, submittedAnswer) => {
            console.log('Block 1 Submitted:', data.id, 'Answer:', submittedAnswer);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }}
          onContinue={async (data) => {
            console.log('Block 1 Continue:', data.id);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }}
        />
        
        <ContradictionBlock
          data={data2}
          status={BlockStatus.IN_PROGRESS}
          onSubmit={async (data, submittedAnswer) => {
            console.log('Block 2 Submitted:', data.id, 'Answer:', submittedAnswer);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }}
          onContinue={async (data) => {
            console.log('Block 2 Continue:', data.id);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step('验证两个矛盾块都已渲染', async () => {
      await expect(canvas.getByText('Block 1: Math Contradiction')).toBeInTheDocument();
      await expect(canvas.getByText('Block 2: Logic Contradiction')).toBeInTheDocument();
    });
    
    await step('验证每个矛盾块的选项都已渲染', async () => {
      // 第一个矛盾块的选项
      await expect(canvas.getByText('2 + 2 = 4')).toBeInTheDocument();
      await expect(canvas.getByText('2 + 2 = 5')).toBeInTheDocument();
      
      // 第二个矛盾块的选项
      await expect(canvas.getByText('All birds can fly.')).toBeInTheDocument();
      await expect(canvas.getByText('Penguins are birds that cannot fly.')).toBeInTheDocument();
    });
  },
}; 