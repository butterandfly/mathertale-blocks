// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProofEndControl, ProofTombstone } from './ProofEndControl';
import { expect, within } from '@storybook/test';
import { useState } from 'react';

const meta = {
  title: 'Blocks/ProofEndControl',
  component: ProofEndControl,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProofEndControl>;

export default meta;
type Story = StoryObj<typeof ProofEndControl>;

// Initial state with no tombstone selected
export const Initial: Story = {
  args: {
    continueValue: undefined,
    onSelect: async (tombstone) => {
      console.log('Selected tombstone:', tombstone);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check if the title exists
    await expect(canvas.getByText('Choose the tombstone for this proof:')).toBeInTheDocument();
    
    // Check if all emoji buttons are rendered
    await expect(canvas.getByText('🪦')).toBeInTheDocument();
    await expect(canvas.getByText('❤️')).toBeInTheDocument();
    await expect(canvas.getByText('🌼')).toBeInTheDocument();
    await expect(canvas.getByText('□')).toBeInTheDocument();
  },
};

// State with a tombstone already selected
export const WithSelectedTombstone: Story = {
  args: {
    continueValue: '🪦',
    onSelect: async (tombstone) => {
      console.log('Selected tombstone:', tombstone);
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check if the selected tombstone is displayed
    await expect(canvas.getByText('🪦')).toBeInTheDocument();
    
    // Check that the selection UI is not shown
    await expect(canvas.queryByText('Choose the tombstone for this proof:')).not.toBeInTheDocument();
  },
};

// Interactive story that allows selecting different tombstones
export const Interactive: Story = {
  render: function Render() {
    const [continueValue, setContinueValue] = useState<string | undefined>(undefined);
    
    return (
      <div className="space-y-4">
        <ProofEndControl
          continueValue={continueValue}
          onSelect={async (tombstone) => {
            console.log('Selected tombstone:', tombstone);
            setContinueValue(tombstone);
          }}
        />
        
        <div className="mt-4 p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-slate-500">
            {continueValue 
              ? `Selected ending: ${continueValue}` 
              : 'No ending selected yet'}
          </p>
          <button
            onClick={() => setContinueValue(undefined)}
            className="mt-2 px-3 py-1 text-xs bg-slate-200 rounded hover:bg-slate-300"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
};

// Story showing all possible tombstones at once for comparison
export const AllTombstones: Story = {
  render: function Render() {
    const tombstones: ProofTombstone[] = ['🪦', '❤️', '🌼', '□'];
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-slate-700">All available proof endings:</h3>
        
        {tombstones.map(tombstone => (
          <div key={tombstone} className="p-4 border rounded-lg">
            <ProofEndControl
              continueValue={tombstone}
              onSelect={async () => {}}
            />
          </div>
        ))}
      </div>
    );
  },
}; 