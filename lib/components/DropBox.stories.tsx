// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DropBox, DropBoxColor } from './DropBox';
import { DraggableMarkdownItem } from './DraggableMarkdownItem';
import { DndContext } from '@dnd-kit/core';

const meta = {
  title: 'Components/DropBox',
  component: DropBox,
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
} satisfies Meta<typeof DropBox>;

export default meta;
type Story = StoryObj<typeof DropBox>;

export const Empty: Story = {
  args: {
    id: 'box-1',
    color: 'blue',
  },
  // play: async ({ canvasElement, step }) => {
  //   const canvas = within(canvasElement);

  //   await step('Check if drop box is rendered', async () => {
  //     const dropBox = canvas.getByRole('button');
  //     expect(dropBox).toBeInTheDocument();
  //   });
  // },
};

export const WithItem: Story = {
  render: (args) => (
    <DropBox {...args}>
      <DraggableMarkdownItem
        id="item-1"
        content="## Item in Box\nThis item is inside a drop box."
        containerGroup={args.containerGroup}
      />
    </DropBox>
  ),
  args: {
    id: 'box-with-item',
    color: 'green',
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(['red', 'blue', 'green', 'yellow'] as DropBoxColor[]).map((color) => (
        <DropBox
          key={color}
          id={`box-${color}`}
          color={color}
        >
          <div className="p-2 text-center font-medium">
            {color.charAt(0).toUpperCase() + color.slice(1)} Box
          </div>
        </DropBox>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    id: 'box-disabled',
    color: 'blue',
    disabled: true,
  },
};
