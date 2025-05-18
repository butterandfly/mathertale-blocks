// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DraggableMarkdownItem } from './DraggableMarkdownItem';
import { expect, within } from '@storybook/test';
import { DndContext } from '@dnd-kit/core';

const meta = {
  title: 'Blocks/DraggableMarkdownItem',
  component: DraggableMarkdownItem,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <DndContext>
        <div style={{ width: '400px' }}>
          <Story />
        </div>
      </DndContext>
    ),
  ],
} satisfies Meta<typeof DraggableMarkdownItem>;

export default meta;
type Story = StoryObj<typeof DraggableMarkdownItem>;

export const Basic: Story = {
  args: {
    id: 'item-1',
    content: '## Draggable Item\nThis is a draggable item with **markdown** content.',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Wait for content to load', async () => {
      await expect(canvas.getByText('Draggable Item')).toBeInTheDocument();
    });
  },
};

export const WithMathContent: Story = {
  args: {
    id: 'item-math',
    content:
      '## Math Content\nWhen $a \\ne 0$, there are two solutions to $ax^2 + bx + c = 0$ and they are:\n\n$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$',
  },
};

export const WithCodeContent: Story = {
  args: {
    id: 'item-code',
    content:
      '## Code Content\n```typescript\nfunction greet(name: string) {\n  return `Hello, ${name}!`;\n}\n```',
  },
};

export const Disabled: Story = {
  args: {
    id: 'item-disabled',
    content: '## Disabled Item\nThis item cannot be dragged.',
    disabled: true,
  },
};
