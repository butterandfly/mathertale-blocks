// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DraggableMarkdownItem } from './DraggableMarkdownItem';
import { expect, within } from '@storybook/test';
import {
  DndContext,
  type DragEndEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { DropBox } from './DropBox';
import { useState } from 'react';

const meta = {
  title: 'Components/DraggableMarkdownItem',
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

// 专门测试拖拽样式的story
export const DragStyleTesting: Story = {
  render: () => {
    const [droppedItems, setDroppedItems] = useState<string[]>([]);

    const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          distance: 5,
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 100,
          tolerance: 5,
        },
      }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        // 如果拖到外面，从drop box中移除
        setDroppedItems((prev) => prev.filter((id) => id !== active.id));
        return;
      }

      if (over.id === 'drop-box') {
        // 如果拖到drop box中，添加到已放置项目
        setDroppedItems((prev) => {
          if (!prev.includes(active.id as string)) {
            return [...prev, active.id as string];
          }
          return prev;
        });
      } else {
        // 如果拖到其他地方，从drop box中移除
        setDroppedItems((prev) => prev.filter((id) => id !== active.id));
      }
    };

    const availableItems = [
      {
        id: 'item-1',
        content: '## First Item\nThis is the first draggable item with **bold** text.',
      },
      { id: 'item-2', content: "## Math Formula\nEinstein's equation: $E = mc^2$" },
      { id: 'item-3', content: '## Code Block\n```javascript\nconsole.log("Hello World!");\n```' },
      { id: 'item-4', content: '## List Item\n- Point 1\n- Point 2\n- Point 3' },
    ].filter((item) => !droppedItems.includes(item.id));

    const droppedItemsData = [
      {
        id: 'item-1',
        content: '## First Item\nThis is the first draggable item with **bold** text.',
      },
      { id: 'item-2', content: "## Math Formula\nEinstein's equation: $E = mc^2$" },
      { id: 'item-3', content: '## Code Block\n```javascript\nconsole.log("Hello World!");\n```' },
      { id: 'item-4', content: '## List Item\n- Point 1\n- Point 2\n- Point 3' },
    ].filter((item) => droppedItems.includes(item.id));

    return (
      <div className="w-full max-w-4xl">
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Drag Style Testing</h2>
          <p className="text-sm text-gray-600">
            Drag items between the available area and the drop box to test styling changes. Watch
            how items behave when dragged in and out of the drop zone.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-6">
            {/* Drop Box Area */}
            <div className="space-y-2">
              <h3 className="font-medium text-blue-700">Drop Box (Blue Zone)</h3>
              <DropBox
                id="drop-box"
                color="blue"
                className="min-h-[200px]"
              >
                <div className="space-y-2">
                  {droppedItemsData.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      Drag items here to see styling changes
                    </div>
                  ) : (
                    droppedItemsData.map((item) => (
                      <DraggableMarkdownItem
                        key={item.id}
                        id={item.id}
                        content={item.content}
                      />
                    ))
                  )}
                </div>
              </DropBox>
            </div>

            {/* Available Items Area */}
            {availableItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Available Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  {availableItems.map((item) => (
                    <DraggableMarkdownItem
                      key={item.id}
                      id={item.id}
                      content={item.content}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-sm space-y-2 bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium">Testing Instructions:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>
                  <strong>Drag into box:</strong> Watch how the item transforms when entering the
                  blue drop zone
                </li>
                <li>
                  <strong>Drag out of box:</strong> See how the item changes when leaving the drop
                  zone
                </li>
                <li>
                  <strong>Hover effects:</strong> Notice border and background changes when hovering
                  over drop zones
                </li>
                <li>
                  <strong>Size changes:</strong> Check if items maintain their proportions during
                  drag
                </li>
                <li>
                  <strong>Multiple items:</strong> Try dragging multiple items to test isolation
                </li>
              </ul>
            </div>
          </div>
        </DndContext>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [], // 覆盖默认的decorator，因为我们需要自己的DndContext
};
