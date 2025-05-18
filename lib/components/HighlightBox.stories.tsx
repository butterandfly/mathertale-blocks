import type { Meta, StoryObj } from '@storybook/react';
import { HighlightBox } from './HighlightBox';
import { expect, within } from '@storybook/test';

const meta = {
  title: 'Components/HighlightBox',
  component: HighlightBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HighlightBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a highlight box with default theme (blue)',
    theme: 'blue',
    withBackground: true,
    tag: 'Definition',
  },
};

export const WithQuestionMark: Story = {
  args: {
    children: 'This is a highlight box with a question mark badge next to the tag',
    theme: 'blue',
    withBackground: true,
    tag: 'Definition',
    questionMarkContent: 'This is additional information about this definition box.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const questionMark = canvas.getByText('?');
    await expect(questionMark).toBeInTheDocument();
  },
};

export const WithMarkdownTooltip: Story = {
  args: {
    children: 'This highlight box has a tooltip with markdown content',
    theme: 'green',
    withBackground: true,
    tag: 'Theorem',
    questionMarkContent:
      '**Important Note:**\n\nThis theorem is a fundamental result that states:\n\n$$E = mc^2$$\n\nWhere:\n- $E$ is energy\n- $m$ is mass\n- $c$ is the speed of light',
  },
};

export const NoTag: Story = {
  args: {
    children: 'This is a highlight box without tag',
    theme: 'blue',
    withBackground: true,
  },
};

export const NoBackground: Story = {
  args: {
    children: 'This is a highlight box without background',
    theme: 'blue',
    withBackground: false,
    tag: 'Definition',
  },
};

export const GreenTheme: Story = {
  args: {
    children: 'This is a highlight box with green theme',
    theme: 'green',
    withBackground: true,
    tag: 'Success',
  },
};

// export const WithMarkdown: Story = {
//   args: {
//     children: (
//       <div className="prose prose-slate">
//         <h3>Markdown Content</h3>
//         <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
//         <ul>
//           <li>List item 1</li>
//           <li>List item 2</li>
//         </ul>
//       </div>
//     ),
//     theme: 'blue',
//     withBackground: true,
//     tag: 'Example'
//   },
// };

export const GrayTheme: Story = {
  args: {
    children: 'This is a highlight box with gray theme',
    theme: 'gray',
    withBackground: true,
    tag: 'Note',
  },
};
