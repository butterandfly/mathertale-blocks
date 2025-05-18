import type { Meta, StoryObj } from '@storybook/react';
import { ReorderContent } from './ReorderContent';
import { expect, within } from '@storybook/test';

const meta = {
  title: 'Blocks/ReorderContent',
  component: ReorderContent,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ReorderContent>;

export default meta;
type Story = StoryObj<typeof ReorderContent>;

const sampleItems = [
  {
    id: '1',
    content: '# First Paragraph\nThis is the first paragraph with some **bold** text.',
  },
  {
    id: '2',
    content: '## Second Paragraph\nThis is the second paragraph with *italic* text.',
  },
  {
    id: '3',
    content: '### Third Paragraph\nThis is the third paragraph with some `code` text.',
  },
];

export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

export const Disabled: Story = {
  args: {
    items: sampleItems,
    disabled: true,
  },
};

export const WithGreenHighlight: Story = {
  args: {
    items: sampleItems,
    highlight: 'green',
  },
};

export const WithBlueHighlight: Story = {
  args: {
    items: sampleItems,
    highlight: 'blue',
  },
};

export const WithRedHighlight: Story = {
  args: {
    items: sampleItems,
    highlight: 'red',
  },
};

export const DisabledWithHighlight: Story = {
  args: {
    items: sampleItems,
    disabled: true,
    highlight: 'green',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 检查内容是否正确渲染
    await expect(canvas.getByText('First Paragraph')).toBeInTheDocument();
    await expect(canvas.getByText('Second Paragraph')).toBeInTheDocument();
    await expect(canvas.getByText('Third Paragraph')).toBeInTheDocument();

    // 检查是否有正确的高亮样式
    const items = canvas.getAllByRole('button');
    items.forEach(async (item) => {
      await expect(item).toHaveClass('cursor-default');
    });
  },
};

export const WithCallback: Story = {
  args: {
    items: sampleItems,
    onOrderChange: (newItems: unknown) => {
      console.log('New order:', newItems);
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // 等待内容加载
    await step('Wait for content to load', async () => {
      await expect(canvas.getByText('First Paragraph')).toBeInTheDocument();
    });

    // 检查所有段落是否都正确渲染
    await step('Check if all paragraphs are rendered', async () => {
      await expect(canvas.getByText('Second Paragraph')).toBeInTheDocument();
      await expect(canvas.getByText('Third Paragraph')).toBeInTheDocument();
    });

    // 检查拖动手柄是否存在
    await step('Check if drag handles exist', async () => {
      const dragHandles = await canvas.findAllByRole('button');
      await expect(dragHandles).toHaveLength(3);
    });
  },
};
