import type { Meta, StoryObj } from '@storybook/react';
import { QuestionMarkBadge } from './QuestionMarkBadge';
import { userEvent, within } from '@storybook/test';

const meta = {
  title: 'Components/QuestionMarkBadge',
  component: QuestionMarkBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuestionMarkBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip with helpful information',
    color: 'gray',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText('?');
    
    await step('Hover over badge to show tooltip', async () => {
      await userEvent.hover(badge);
      // Wait for tooltip to appear
      await new Promise(resolve => setTimeout(resolve, 300));
    });
  },
};

export const LongText: Story = {
  args: {
    content: 'This is a tooltip with helpful information that is longer than the default tooltip width.\n\n This is a tooltip with helpful information that is longer than the default tooltip width.\n\n This is a tooltip with helpful information that is longer than the default tooltip width.',
    color: 'gray',
  },
};

export const GreenBadge: Story = {
  args: {
    content: 'This is a green badge with tooltip',
    color: 'green',
  },
};

export const BlueBadge: Story = {
  args: {
    content: 'This is a blue badge with tooltip',
    color: 'blue',
  },
};

export const YellowBadge: Story = {
  args: {
    content: 'This is a yellow badge with tooltip',
    color: 'yellow',
  },
};

export const RedBadge: Story = {
  args: {
    content: 'This is a red badge with tooltip',
    color: 'red',
  },
};

export const WithHighlightBox: Story = {
  args: {
    content: "This is additional information about the definition",
    color: "blue"
  },
  render: (args) => (
    <div className="w-96">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-medium">Definition</h3>
        <QuestionMarkBadge 
          {...args}
        />
      </div>
      <div className="p-4 border-2 border-blue-200 bg-blue-50/50 rounded-lg">
        <p>A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers.</p>
      </div>
    </div>
  ),
};

export const WithBlockHeadline: Story = {
  args: {
    content: "This section contains critical information",
    color: "red"
  },
  render: (args) => (
    <div className="w-96">
      <div className="flex items-center justify-center gap-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="flex items-center gap-1">
          <span className="text-slate-600 font-semibold text-lg">Important Section</span>
          <QuestionMarkBadge 
            {...args}
          />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>
      <div className="mt-4 p-4 border border-slate-200 rounded-lg">
        <p>Content of the important section goes here.</p>
      </div>
    </div>
  ),
};

export const WithMarkdown: Story = {
  args: {
    content: "**Important Information**\n\nThis tooltip contains *formatted markdown* content with [links](https://example.com).",
    color: 'blue',
  },
};

export const WithMath: Story = {
  args: {
    content: "## Math Formula\n\nThe quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n\nAnd here's an equation block:\n\n$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$",
    color: 'green',
  },
}; 