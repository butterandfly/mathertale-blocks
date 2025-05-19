import type { Meta, StoryObj } from '@storybook/react';
import { BlockHeadline } from './BlockHeadline';
import { expect, within } from '@storybook/test';

const meta: Meta<typeof BlockHeadline> = {
  title: 'Components/BlockHeadline',
  component: BlockHeadline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BlockHeadline>;

export const Default: Story = {
  args: {
    title: 'Proof',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headline = canvas.getByText('Proof');
    await expect(headline).toBeInTheDocument();
  },
};

export const WithQuestionMark: Story = {
  args: {
    title: 'Definition',
    questionMarkContent:
      'This section contains important definitions that will be used throughout the proof.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headline = canvas.getByText('Definition');
    const questionMark = canvas.getByText('?');
    await expect(headline).toBeInTheDocument();
    await expect(questionMark).toBeInTheDocument();
  },
};

export const WithMarkdownTooltip: Story = {
  args: {
    title: 'Theorem',
    questionMarkContent:
      '**Important Note:**\n\nThis theorem is a fundamental result in *number theory* that states:\n\n$$\\forall n \\in \\mathbb{N}, n > 1: n \\text{ is prime } \\iff \\nexists a,b \\in \\mathbb{N}: n = a \\times b \\land a,b > 1$$',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This is a very long title for testing purposes',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headline = canvas.getByText('This is a very long title for testing purposes');
    await expect(headline).toBeInTheDocument();
  },
};

export const WithEmoji: Story = {
  args: {
    title: '🪦',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headline = canvas.getByText('🪦');
    await expect(headline).toBeInTheDocument();
  },
};
