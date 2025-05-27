import type { Meta, StoryObj } from '@storybook/react';
import { ParaBlock } from './ParaBlock';
import { ParaType, type ParaBlockData } from '../core/blocks/para-block';
import { BlockStatus } from '../core/schemas';

const meta = {
  title: 'Blocks/ParaBlock',
  component: ParaBlock,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ParaBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultData: ParaBlockData = {
  id: '1',
  type: ParaType,
  headline: '',
  content: '这是一段示例文本，用于测试 ParaBlock 组件。\n\n包含**加粗**和*斜体*等 Markdown 格式。',
  updatedAt: new Date('2024-01-01'),
  getText: () => '这是一段示例文本，用于测试 ParaBlock 组件。包含加粗和斜体等 Markdown 格式。',
};

export const Default: Story = {
  args: {
    data: defaultData,
    status: BlockStatus.IN_PROGRESS,
    onContinue: () => Promise.resolve(),
  },
};

export const WithHeadline: Story = {
  args: {
    data: {
      ...defaultData,
      headline: 'Title',
      getText: () => '',
    },
    status: BlockStatus.IN_PROGRESS,
    onContinue: () => Promise.resolve(),
  },
};

export const LongContent: Story = {
  args: {
    data: {
      ...defaultData,
      id: '2',
      content: '这是一段很长的文本内容。\n\n'.repeat(5),
      getText: () => '这是一段很长的文本内容。'.repeat(5),
    },
    status: BlockStatus.IN_PROGRESS,
    onContinue: () => Promise.resolve(),
  },
};

export const Completed: Story = {
  args: {
    data: {
      ...defaultData,
      id: '3',
      content: '这是一个已完成状态的段落。',
      getText: () => '这是一个已完成状态的段落。',
    },
    status: BlockStatus.COMPLETED,
    onContinue: () => Promise.resolve(),
  },
};

export const SVGContent: Story = {
  args: {
    data: {
      ...defaultData,
      id: '4',
      content:
        '<svg width="300" height="180"><circle id="circleA" cx="100" cy="100" r="50" fill="rgb(168, 168, 168)" /><path d="M100 100 L150 100" stroke="rgb(168, 168, 168)" stroke-width="2" /></svg>',
      getText: () => '这是一个 SVG 内容。',
    },
    status: BlockStatus.IN_PROGRESS,
    onContinue: () => Promise.resolve(),
  },
};

export const ReadOnly: Story = {
  args: {
    data: {
      ...defaultData,
      id: '5',
      headline: 'Read-Only Block',
      content:
        '这是一个只读模式的段落块。注意没有继续按钮。\n\n包含**加粗**和*斜体*等 Markdown 格式。',
      getText: () => '这是一个只读模式的段落块。',
    },
    status: BlockStatus.IN_PROGRESS,
    onContinue: () => Promise.resolve(),
    readonly: true,
  },
};
