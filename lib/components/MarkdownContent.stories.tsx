import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownContent } from './MarkdownContent';

const meta = {
  title: 'Components/MarkdownContent',
  component: MarkdownContent,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MarkdownContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    content: `
# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2
- List item 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

Image:
![Sans](http://localhost:3000/sans.png)
    `,
  },
};

export const WithSVG: Story = {
  args: {
    content: `
# SVG Example

<svg width="300" height="180"
viewBox="0 0 200 150" preserveAspectRatio="xMidYMid meet"
     style="display: inline-block; max-width: 100%; height: auto;
            border: 1px solid #ccc; background-color: #ffffff;" >
  <circle cx="80" cy="75" r="50"
          style="fill: #6c757d; opacity: 0.4;"/>
  <circle cx="120" cy="75" r="50"
          style="fill: #6c757d; opacity: 0.4;"/>
  <circle cx="80" cy="75" r="50"
          style="stroke: #007bff; stroke-width: 2; fill: none;"/>
  <circle cx="120" cy="75" r="50"
          style="stroke: #dc3545; stroke-width: 2; fill: none;"/>
  <text x="50" y="75"
        style="font-size: 16px; font-weight: bold; fill: #212529;">
    A
  </text>
  <text x="150" y="75"
        style="font-size: 16px; font-weight: bold; fill: #212529;">
    B
  </text>
</svg>
`,
  },
};

export const WithMath: Story = {
  args: {
    content: `
# Mathematical Expressions

Inline math: When $a \\ne 0$, there are two solutions to $ax^2 + bx + c = 0$ and they are:

$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$

Some more complex equations:

$$
\\begin{aligned}
\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\
\\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\
\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} & = \\vec{\\mathbf{0}} \\\\
\\nabla \\cdot \\vec{\\mathbf{B}} & = 0
\\end{aligned}
\\\\
\\begin{align}
\\sqrt{ 2 }&=\\frac{p}{q} \\\\
2&=\\frac{p^2}{q^2} \\\\
2q^2&=p^2
\\end{align}
$$

    `,
  },
};

export const WithCode: Story = {
  args: {
    content: `
# Code Examples

Inline code: \`console.log('Hello World')\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# Print first 10 Fibonacci numbers
for i in range(10):
    print(fibonacci(i))
\`\`\`

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greetUser(user: User) {
  console.log(\`Hello, \${user.name}!\`);
}
\`\`\`
    `,
  },
};

export const Mixed: Story = {
  args: {
    content: `
# Mixed Content Example

## Introduction
This is a demonstration of mixed content including text, math, and code.

## Mathematical Concept
When we have a quadratic equation $ax^2 + bx + c = 0$, we can solve it using the quadratic formula:

$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$

## Implementation
Here's how we might implement this in code:

\`\`\`python
import math

def solve_quadratic(a, b, c):
    discriminant = b**2 - 4*a*c
    if discriminant < 0:
        return None
    x1 = (-b + math.sqrt(discriminant)) / (2*a)
    x2 = (-b - math.sqrt(discriminant)) / (2*a)
    return x1, x2
\`\`\`

## Properties
- Works for all real coefficients where $a \\ne 0$
- Has two solutions when $b^2 - 4ac > 0$
- Has one solution when $b^2 - 4ac = 0$
- Has no real solutions when $b^2 - 4ac < 0$
    `,
  },
};
