// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectionBlock } from './SelectionBlock';
import { BlockStatus } from '../core/schemas';
import { expect, userEvent, within } from '@storybook/test';
import { type SelectionBlockData, SelectionType } from '../core/blocks/selection-block';

const meta = {
  title: 'Blocks/SelectionBlock',
  component: SelectionBlock,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SelectionBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultData: SelectionBlockData = {
  id: 'block-1',
  type: SelectionType,
  content: 'Select all the prime numbers from the list below.',
  questionData: {
    choices: [
      { key: 'A', content: '2' },
      { key: 'B', content: '4' },
      { key: 'C', content: '5' },
      { key: 'D', content: '6' },
      { key: 'E', content: '7' },
      { key: 'F', content: '9' },
    ],
    answer: ['A', 'C', 'E'],
    explanation:
      'Prime numbers are natural numbers greater than 1 that have no positive divisors other than 1 and themselves. The prime numbers in this list are 2, 5, and 7.',
  },
  updatedAt: new Date('2024-01-01'),
  getText: () => 'Select all the prime numbers from the list below.',
};

// 基础用例
export const Default: Story = {
  args: {
    data: defaultData,
    status: BlockStatus.IN_PROGRESS,
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

// 正确回答用例
export const CorrectAnswer: Story = {
  args: {
    ...Default.args,
    submittedAnswer: 'A,C,E',
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
      await expect(
        canvas.getByText('Prime numbers are natural numbers', { exact: false }),
      ).toBeInTheDocument();
    });
  },
};

// 错误回答用例
export const WrongAnswer: Story = {
  args: {
    ...Default.args,
    submittedAnswer: 'A,B,D',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('验证错误状态显示', async () => {
      await expect(canvas.getByText('🤔')).toBeInTheDocument();
      await expect(canvas.getByText('Not quite right.')).toBeInTheDocument();
    });
  },
};

// 单选正确答案用例
export const SingleCorrectAnswer: Story = {
  args: {
    data: {
      ...defaultData,
      content: 'Select the largest planet in our solar system.',
      questionData: {
        choices: [
          { key: 'A', content: 'Earth' },
          { key: 'B', content: 'Jupiter' },
          { key: 'C', content: 'Mars' },
          { key: 'D', content: 'Saturn' },
        ],
        answer: ['B'],
        explanation: 'Jupiter is the largest planet in our solar system by both mass and volume.',
      },
      getText: () => 'Select the largest planet in our solar system.',
    },
    submittedAnswer: 'B',
    status: BlockStatus.IN_PROGRESS,
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

// 已完成状态用例
export const Completed: Story = {
  args: {
    ...Default.args,
    status: BlockStatus.COMPLETED,
    submittedAnswer: 'A,C,E',
  },
};

// 数学概念选择的例子
export const MathConceptSelection: Story = {
  args: {
    data: {
      ...defaultData,
      content:
        '## Properties of Real Numbers\n\nSelect all the properties that apply to the set of real numbers $\\mathbb{R}$.',
      questionData: {
        choices: [
          {
            key: 'A',
            content:
              'Closure under addition: For all $a, b \\in \\mathbb{R}$, we have $a + b \\in \\mathbb{R}$',
          },
          {
            key: 'B',
            content: 'Existence of multiplicative inverse for zero: $0^{-1} \\in \\mathbb{R}$',
          },
          { key: 'C', content: 'Completeness: Every non-empty bounded subset has a supremum' },
          { key: 'D', content: 'Discreteness: There exists a smallest positive real number' },
          {
            key: 'E',
            content:
              'Commutativity of multiplication: For all $a, b \\in \\mathbb{R}$, we have $ab = ba$',
          },
          {
            key: 'F',
            content:
              'Associativity of addition: For all $a, b, c \\in \\mathbb{R}$, we have $(a + b) + c = a + (b + c)$',
          },
        ],
        answer: ['A', 'C', 'E', 'F'],
        explanation:
          'Real numbers satisfy closure under addition, completeness, commutativity of multiplication, and associativity of addition. However, zero has no multiplicative inverse, and there is no smallest positive real number.',
      },
      getText: () =>
        'Properties of Real Numbers. Select all the properties that apply to the set of real numbers.',
    },
    status: BlockStatus.IN_PROGRESS,
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

// 多选题，顺序无关的测试
export const OrderIndependentAnswer: Story = {
  args: {
    data: {
      ...defaultData,
      content: 'Select all the even numbers.',
      questionData: {
        choices: [
          { key: 'A', content: '2' },
          { key: 'B', content: '3' },
          { key: 'C', content: '4' },
          { key: 'D', content: '5' },
          { key: 'E', content: '6' },
        ],
        answer: ['A', 'C', 'E'],
        explanation:
          'Even numbers are divisible by 2. The even numbers in this list are 2, 4, and 6.',
      },
      getText: () => 'Select all the even numbers.',
    },
    submittedAnswer: 'E,A,C', // 不同的顺序，但应该是正确的
    status: BlockStatus.IN_PROGRESS,
    onSubmit: async (data, submittedAnswer) => {
      console.log('Submitted:', data.id, 'Answer:', submittedAnswer);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onContinue: async (data) => {
      console.log('Continue:', data.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('验证不同顺序的答案也被认为是正确的', async () => {
      await expect(canvas.getByText('🎉')).toBeInTheDocument();
      await expect(canvas.getByText('Correct!')).toBeInTheDocument();
    });
  },
};

// 测试两个选择块在同一页面的隔离性
export const TwoSelectionBlocks: Story = {
  args: {
    ...Default.args,
  },
  render: () => {
    // 第一个选择块数据 - 简单的数学选择
    const data1: SelectionBlockData = {
      id: 'block-1',
      type: SelectionType,
      content: '## Block 1: Even Numbers\n\nSelect all even numbers.',
      questionData: {
        choices: [
          { key: 'A', content: '1' },
          { key: 'B', content: '2' },
          { key: 'C', content: '3' },
          { key: 'D', content: '4' },
        ],
        answer: ['B', 'D'],
        explanation: 'Even numbers are divisible by 2. In this list: 2 and 4 are even.',
      },
      updatedAt: new Date('2024-01-01'),
      getText: () => 'Block 1: Even Numbers. Select all even numbers.',
    };

    // 第二个选择块数据 - 简单的科学选择
    const data2: SelectionBlockData = {
      id: 'block-2',
      type: SelectionType,
      content: '## Block 2: Planets\n\nSelect all planets in our solar system.',
      questionData: {
        choices: [
          { key: 'X', content: 'Earth' },
          { key: 'Y', content: 'Moon' },
          { key: 'Z', content: 'Mars' },
          { key: 'W', content: 'Sun' },
        ],
        answer: ['X', 'Z'],
        explanation: 'Earth and Mars are planets. The Moon is a satellite and the Sun is a star.',
      },
      updatedAt: new Date('2024-01-01'),
      getText: () => 'Block 2: Planets. Select all planets in our solar system.',
    };

    return (
      <div className="space-y-8 max-w-3xl">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-bold mb-4">Testing Isolation Between Selection Blocks</h2>
          <p className="mb-4">
            This story tests that two SelectionBlocks on the same page are properly isolated. You
            should be able to drag items in each block independently without affecting the other
            block.
          </p>
        </div>

        <SelectionBlock
          data={data1}
          status={BlockStatus.IN_PROGRESS}
          onSubmit={async (data, submittedAnswer) => {
            console.log('Block 1 Submitted:', data.id, 'Answer:', submittedAnswer);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
          onContinue={async (data) => {
            console.log('Block 1 Continue:', data.id);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
        />

        <SelectionBlock
          data={data2}
          status={BlockStatus.IN_PROGRESS}
          onSubmit={async (data, submittedAnswer) => {
            console.log('Block 2 Submitted:', data.id, 'Answer:', submittedAnswer);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
          onContinue={async (data) => {
            console.log('Block 2 Continue:', data.id);
            await new Promise((resolve) => setTimeout(resolve, 1000));
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

    await step('验证两个选择块都已渲染', async () => {
      await expect(canvas.getByText('Block 1: Even Numbers')).toBeInTheDocument();
      await expect(canvas.getByText('Block 2: Planets')).toBeInTheDocument();
    });

    await step('验证每个选择块的选项都已渲染', async () => {
      // 第一个选择块的选项
      await expect(canvas.getByText('1')).toBeInTheDocument();
      await expect(canvas.getByText('2')).toBeInTheDocument();

      // 第二个选择块的选项
      await expect(canvas.getByText('Earth')).toBeInTheDocument();
      await expect(canvas.getByText('Mars')).toBeInTheDocument();
    });
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

    // 检查正确答案是否在绿色选择框中
    await expect(canvas.getByText('Selected Options')).toBeInTheDocument();

    // 检查解释是否显示
    await expect(canvas.getByText('Explanation')).toBeInTheDocument();
    await expect(
      canvas.getByText('Prime numbers are natural numbers', { exact: false }),
    ).toBeInTheDocument();

    // 验证没有提交按钮
    await expect(canvas.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();

    // 验证没有继续按钮
    await expect(canvas.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
  },
};

// 复杂数学表达式的选择
export const ComplexMathExpressions: Story = {
  args: {
    data: {
      ...defaultData,
      content: '## Calculus Functions\n\nSelect all functions that are differentiable at $x = 0$.',
      questionData: {
        choices: [
          { key: 'A', content: '$f(x) = x^2$' },
          { key: 'B', content: '$f(x) = |x|$' },
          { key: 'C', content: '$f(x) = \\sin(x)$' },
          { key: 'D', content: '$f(x) = \\sqrt[3]{x}$' },
          {
            key: 'E',
            content:
              '$f(x) = \\begin{cases} x^2 & \\text{if } x \\geq 0 \\\\ -x^2 & \\text{if } x < 0 \\end{cases}$',
          },
        ],
        answer: ['A', 'C', 'D'],
        explanation:
          'Functions $f(x) = x^2$, $f(x) = \\sin(x)$, and $f(x) = \\sqrt[3]{x}$ are all differentiable at $x = 0$. However, $f(x) = |x|$ is not differentiable at $x = 0$ due to the sharp corner, and the piecewise function is not differentiable at $x = 0$ due to different left and right derivatives.',
      },
      getText: () => 'Calculus Functions. Select all functions that are differentiable at x = 0.',
    },
    status: BlockStatus.IN_PROGRESS,
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
