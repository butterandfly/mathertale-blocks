import type { Meta, StoryObj } from '@storybook/react';
import { ReadonlyQuest } from './ReadonlyQuest';
import { type BaseQuestSchema, Category } from '../core/schemas';

// Import block types and data classes
import { ParaBlockData } from '../core/blocks/para-block';
import {
  DefinitionType,
  FactType,
  TheoremType,
  RemarkType,
  NotedBlockData,
} from '../core/blocks/noted-block';
import { SingleChoiceBlockData } from '../core/blocks/single-choice-block';
import { ProofReorderBlockData } from '../core/blocks/proof-reorder-block';
import { ContradictionBlockData } from '../core/blocks/contradiction-block';
import { TombstoneBlockData } from '../core/blocks/tombstone-block';

const meta = {
  title: 'Components/ReadonlyQuest',
  component: ReadonlyQuest,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ReadonlyQuest>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create mock blocks
const createParaBlock = (id: string, content: string, headline?: string): ParaBlockData =>
  new ParaBlockData(id, content, headline || '', new Date('2024-01-01'));

const createDefinitionBlock = (id: string, name: string, content: string): NotedBlockData =>
  new NotedBlockData(id, content, DefinitionType, name, new Date('2024-01-01'));

const createFactBlock = (id: string, name: string, content: string): NotedBlockData =>
  new NotedBlockData(id, content, FactType, name, new Date('2024-01-01'));

const createTheoremBlock = (id: string, name: string, content: string): NotedBlockData =>
  new NotedBlockData(id, content, TheoremType, name, new Date('2024-01-01'));

const createRemarkBlock = (id: string, name: string, content: string): NotedBlockData =>
  new NotedBlockData(id, content, RemarkType, name, new Date('2024-01-01'));

const createSingleChoiceBlock = (
  id: string,
  content: string,
  choices: Array<{ key: string; content: string }>,
  answer: string,
  explanation: string,
): SingleChoiceBlockData =>
  new SingleChoiceBlockData(
    id,
    content,
    { choices, answer, explanation },
    undefined,
    new Date('2024-01-01'),
  );

const createProofReorderBlock = (
  id: string,
  content: string,
  parts: string[],
  questionOrder: string,
): ProofReorderBlockData =>
  new ProofReorderBlockData(id, content, {
    orderItems: parts.map((part, index) => ({ id: `${index + 1}`, content: part })),
    questionOrder,
  });

const createContradictionBlock = (
  id: string,
  content: string,
  choices: Array<{ key: string; content: string }>,
  answer: string[],
  explanation: string,
): ContradictionBlockData =>
  new ContradictionBlockData(id, content, { choices, answer, explanation });

const createTombstoneBlock = (id: string): TombstoneBlockData => new TombstoneBlockData(id);

// Sample quest data with all block types
const comprehensiveQuest: BaseQuestSchema = {
  id: 'quest-comprehensive',
  name: 'Complete Mathematical Proof Techniques',
  desc: 'A comprehensive quest demonstrating all available block types for mathematical education.',
  category: Category.FOUNDATIONAL,
  updatedAt: new Date('2024-01-15'),
  blockCount: 10,
  sections: [
    {
      name: 'Basic Concepts',
      blocks: [
        createParaBlock(
          'para-1',
          'Mathematical proofs are the foundation of rigorous mathematics. In this quest, we will explore various proof techniques and logical structures.',
          'Introduction to Proofs',
        ),
        createDefinitionBlock(
          'def-1',
          'Mathematical Proof',
          'A **mathematical proof** is a logical argument that establishes the truth of a mathematical statement beyond any doubt.',
        ),
        createFactBlock(
          'fact-1',
          'Proof by Contradiction',
          'In proof by contradiction, we assume the negation of what we want to prove and show that this leads to a logical contradiction.',
        ),
      ],
    },
    {
      name: 'Interactive Examples',
      blocks: [
        createSingleChoiceBlock(
          'choice-1',
          'Which of the following is a valid proof technique?',
          [
            { key: 'A', content: 'Proof by intimidation' },
            { key: 'B', content: 'Proof by contradiction' },
            { key: 'C', content: 'Proof by wishful thinking' },
            { key: 'D', content: 'Proof by confusion' },
          ],
          'B',
          'Proof by contradiction is a fundamental and valid proof technique in mathematics.',
        ),
        createProofReorderBlock(
          'reorder-1',
          'Arrange the following steps to prove that $\\sqrt{2}$ is irrational:',
          [
            'Assume $\\sqrt{2}$ is rational, so $\\sqrt{2} = \\frac{a}{b}$ where $a, b$ are integers with $\\gcd(a,b) = 1$',
            'Squaring both sides: $2 = \\frac{a^2}{b^2}$, so $2b^2 = a^2$',
            'This means $a^2$ is even, so $a$ must be even. Let $a = 2k$ for some integer $k$',
            'Substituting: $2b^2 = (2k)^2 = 4k^2$, so $b^2 = 2k^2$',
            'This means $b^2$ is even, so $b$ is even',
            'But if both $a$ and $b$ are even, then $\\gcd(a,b) \\geq 2$, contradicting our assumption',
            'Therefore, $\\sqrt{2}$ is irrational',
          ],
          '1,2,3,4,5,6,7',
        ),
        createContradictionBlock(
          'contradiction-1',
          'Identify the two statements that contradict each other in the following logical argument:',
          [
            { key: 'A', content: 'All prime numbers greater than 2 are odd' },
            { key: 'B', content: 'The number 17 is prime' },
            { key: 'C', content: 'The number 4 is prime and even' },
            { key: 'D', content: 'The number 17 is odd' },
          ],
          ['A', 'C'],
          'Statement A says all primes greater than 2 are odd, but statement C claims 4 is both prime and even, which contradicts A since 4 > 2.',
        ),
        createTombstoneBlock('tombstone-1'),
      ],
    },
  ],
};

// Sample quest data (original)
const sampleQuest: BaseQuestSchema = {
  id: 'quest-1',
  name: 'Introduction to Vector Spaces',
  desc: 'A comprehensive introduction to the fundamental concepts of vector spaces in linear algebra.',
  category: Category.ALGEBRA,
  updatedAt: new Date('2024-01-15'),
  blockCount: 7,
  sections: [
    {
      name: 'Basic Concepts',
      blocks: [
        createParaBlock(
          'para-1',
          'Vector spaces are fundamental structures in linear algebra that generalize the familiar concepts of vectors in 2D and 3D space.\n\nIn this quest, we will explore the **formal definition** of vector spaces and examine several important examples.',
          'Introduction',
        ),
        createDefinitionBlock(
          'def-1',
          'Vector Space',
          'A **vector space** $V$ over a field $F$ is a set equipped with two operations:\n\n1. **Vector addition**: $+: V \\times V \\to V$\n2. **Scalar multiplication**: $\\cdot: F \\times V \\to V$\n\nThese operations must satisfy the following axioms:\n- Associativity of addition\n- Commutativity of addition\n- Existence of additive identity\n- Existence of additive inverses\n- Distributivity of scalar multiplication\n- Compatibility of scalar multiplication\n- Identity element of scalar multiplication',
        ),
        createSingleChoiceBlock(
          'choice-1',
          'Which of the following is **not** a required axiom for a vector space?',
          [
            { key: 'A', content: 'Closure under addition' },
            { key: 'B', content: 'Existence of additive identity' },
            { key: 'C', content: 'Commutativity of scalar multiplication' },
            { key: 'D', content: 'Distributive property' },
          ],
          'C',
          'Scalar multiplication in a vector space is not required to be commutative. The operation is between a scalar and a vector, so commutativity would mean $a \\mathbf{v} = \\mathbf{v} a$, which is not a standard requirement.',
        ),
      ],
    },
    {
      name: 'Examples and Properties',
      blocks: [
        createParaBlock(
          'para-2',
          "Let's examine some concrete examples of vector spaces to better understand the abstract definition.",
        ),
        createTheoremBlock(
          'theorem-1',
          'Euclidean Space as Vector Space',
          'The set $\\mathbb{R}^n$ with standard addition and scalar multiplication forms a vector space over $\\mathbb{R}$.\n\n**Proof sketch**: We can verify each axiom:\n- Addition is componentwise: $(x_1, \\ldots, x_n) + (y_1, \\ldots, y_n) = (x_1 + y_1, \\ldots, x_n + y_n)$\n- Scalar multiplication: $c(x_1, \\ldots, x_n) = (cx_1, \\ldots, cx_n)$\n- The zero vector is $(0, \\ldots, 0)$\n- All other axioms follow from properties of real numbers.',
        ),
        createRemarkBlock(
          'remark-1',
          'Infinite-Dimensional Spaces',
          'Not all vector spaces are finite-dimensional like $\\mathbb{R}^n$. For example, the space of all polynomials $\\mathbb{R}[x]$ is infinite-dimensional, as is the space of continuous functions $C([0,1])$.',
        ),
        createSingleChoiceBlock(
          'choice-2',
          'Which of the following sets forms a vector space over $\\mathbb{R}$ with standard operations?',
          [
            { key: 'A', content: 'The set of all $2 \\times 2$ matrices' },
            { key: 'B', content: 'The set of positive real numbers' },
            { key: 'C', content: 'The set $\\{(x, y) \\in \\mathbb{R}^2 : x + y = 1\\}$' },
            { key: 'D', content: 'The set of all polynomials of degree exactly 3' },
          ],
          'A',
          "The set of all $2 \\times 2$ matrices forms a vector space with matrix addition and scalar multiplication. The other options fail various axioms: positive reals lack additive identity, the line $x + y = 1$ is not closed under addition, and polynomials of exactly degree 3 don't include the zero polynomial.",
        ),
      ],
    },
  ],
};

// Minimal quest with just one section
const minimalQuest: BaseQuestSchema = {
  id: 'quest-minimal',
  name: 'Basic Definition',
  desc: 'A simple quest with minimal content.',
  blockCount: 2,
  updatedAt: new Date('2024-01-10'),
  sections: [
    {
      name: 'Introduction',
      blocks: [
        createParaBlock(
          'para-simple',
          'This is a simple paragraph block with some **bold** and *italic* text.',
        ),
        createDefinitionBlock(
          'def-simple',
          'Simple Definition',
          'A **simple definition** is one that is easy to understand and remember.',
        ),
      ],
    },
  ],
};

// Quest with unsupported block type (for testing error handling)
const questWithUnsupportedBlock: BaseQuestSchema = {
  id: 'quest-unsupported',
  name: 'Quest with Unsupported Block',
  desc: 'This quest contains an unsupported block type to test error handling.',
  blockCount: 2,
  updatedAt: new Date('2024-01-10'),
  sections: [
    {
      name: 'Mixed Content',
      blocks: [
        createParaBlock('para-normal', 'This is a normal paragraph block.'),
        // Mock unsupported block
        {
          id: 'unsupported-1',
          type: 'UNSUPPORTED_TYPE',
          content: 'This block type is not supported.',
          getText: () => 'Unsupported block content',
          updatedAt: new Date('2024-01-10'),
        },
      ],
    },
  ],
};

// Default story
export const Default: Story = {
  args: {
    quest: sampleQuest,
  },
};

// Comprehensive story with all block types
export const AllBlockTypes: Story = {
  args: {
    quest: comprehensiveQuest,
  },
};

// Minimal quest story
export const Minimal: Story = {
  args: {
    quest: minimalQuest,
  },
};

// Quest with unsupported block type
export const WithUnsupportedBlock: Story = {
  args: {
    quest: questWithUnsupportedBlock,
  },
};

// Quest with custom styling
export const CustomStyling: Story = {
  args: {
    quest: minimalQuest,
    className: 'max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-lg',
  },
};
