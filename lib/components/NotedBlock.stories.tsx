import type { Meta, StoryObj } from '@storybook/react';
import { BlockStatus } from '../core/schemas';
import {
  NotedBlock,
  renderDefinitionBlock,
  renderPropositionBlock,
  renderRemarkBlock,
  renderTheoremBlock,
} from './NotedBlock';
import { expect, within } from '@storybook/test';
import { type NotedBlockData, DefinitionType } from '../core/blocks/noted-block';

const meta = {
  title: 'Blocks/NotedBlock',
  component: NotedBlock,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NotedBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const blockData: NotedBlockData = {
  id: 'block-1',
  type: DefinitionType,
  name: 'Some Note',
  content: 'This is a note.',
  updatedAt: new Date('2024-01-01'),
  getText: () => 'Some Note. This is a note.',
};

const onContinue = async (data: NotedBlockData) => {
  console.log('Continue clicked');
  console.log(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const defaultArgs = {
  data: blockData,
  status: BlockStatus.IN_PROGRESS,
  tag: 'NOTE',
  theme: 'gray' as const,
  onContinue: onContinue,
};

export const Default: Story = {
  args: defaultArgs,
};

export const Completed: Story = {
  args: {
    ...defaultArgs,
    status: BlockStatus.COMPLETED,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
  },
};

// Story that tests renderDefinitionBlock.
export const Definition: StoryObj = {
  render: () =>
    renderDefinitionBlock({
      data: blockData,
      status: BlockStatus.IN_PROGRESS,
      onContinue: onContinue,
    }),
};

// Story that tests renderTheoremBlock.
export const Theorem: StoryObj = {
  render: () =>
    renderTheoremBlock({
      data: blockData,
      status: BlockStatus.IN_PROGRESS,
      onContinue: onContinue,
    }),
};

// Story that tests renderPropositionBlock.
export const Proposition: StoryObj = {
  render: () =>
    renderPropositionBlock({
      data: blockData,
      status: BlockStatus.IN_PROGRESS,
      onContinue: onContinue,
    }),
};

// Story that tests renderRemarkBlock.
export const Remark: StoryObj = {
  render: () =>
    renderRemarkBlock({
      data: blockData,
      status: BlockStatus.IN_PROGRESS,
      onContinue: onContinue,
    }),
};

export const ReadOnly: Story = {
  args: {
    ...defaultArgs,
    readonly: true,
  },
};

// Story that tests renderDefinitionBlock in readonly mode.
export const DefinitionReadOnly: StoryObj = {
  render: () =>
    renderDefinitionBlock({
      data: blockData,
      status: BlockStatus.IN_PROGRESS,
      onContinue: onContinue,
      readonly: true,
    }),
};
