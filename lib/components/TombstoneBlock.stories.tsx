// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TombstoneBlock } from './TombstoneBlock';
import { BlockStatus } from '../core/schemas';
import { useState } from 'react';
import { TombstoneBlockData, type Tombstone } from '../core/blocks/tombstone-block';

const meta = {
  title: 'Blocks/TombstoneBlock',
  component: TombstoneBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TombstoneBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = new TombstoneBlockData('tombstone-1');

export const Interactive: Story = {
  args: {
    data: sampleData,
    status: BlockStatus.IN_PROGRESS,
    onSubmit: async () => {},
    onContinue: async () => {},
  },
  render: function Render(args) {
    const [submittedAnswer, setSubmittedAnswer] = useState<string | undefined>(undefined);

    return (
      <div className="w-[600px] space-y-4">
        <TombstoneBlock
          {...args}
          submittedAnswer={submittedAnswer as Tombstone}
          onSubmit={async (data, answer) => {
            console.log('data:', data);
            console.log('Submitted answer:', answer);
            setSubmittedAnswer(answer);
          }}
          onContinue={async (data) => {
            console.log('data:', data);
            console.log('Continuing to next block');
          }}
        />
      </div>
    );
  },
};

export const Readonly: Story = {
  args: {
    data: sampleData,
    status: BlockStatus.IN_PROGRESS,
    onSubmit: async () => {},
    onContinue: async () => {},
    readonly: true,
  },
};
