import { marked } from 'marked';
import { expect, describe, it } from 'vitest';

import {
  ProofReorderBlockData,
  ProofReorderType,
  convertProofReorderMarkdown,
} from './proof-reorder-block';
import { type MarkdownBlock } from '../convert-markdown-helper';

describe('ProofReorderBlockData', () => {
  describe('fromMarkdown', () => {
    it('should convert markdown to proof reorder block', () => {
      const markdown = `This is the main content.

#### Part 1
First part content

#### Part 2
Second part content

#### Part 3
Third part content

#### Question Order
3,1,2`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'proof-reorder',
      };

      const result = ProofReorderBlockData.fromMarkdown(blockRaw);

      expect(result).toMatchObject({
        id: 'test-id',
        content: 'This is the main content.',
        type: ProofReorderType,
        questionData: {
          orderItems: [
            { id: '1', content: 'First part content' },
            { id: '2', content: 'Second part content' },
            { id: '3', content: 'Third part content' },
          ],
          questionOrder: '3,1,2',
        },
      });
    });

    it('should handle markdown with name', () => {
      const markdown = `This is the main content.

#### Part 1
First part content

#### Question Order
1`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        name: 'Test Name',
        rawTokens: tokens,
        tag: 'proof-reorder',
      };

      const result = ProofReorderBlockData.fromMarkdown(blockRaw);

      expect(result).toMatchObject({
        id: 'test-id',
        name: 'Test Name',
        content: 'This is the main content.',
        type: ProofReorderType,
        questionData: {
          orderItems: [{ id: '1', content: 'First part content' }],
          questionOrder: '1',
        },
      });
    });

    it('should throw error when parts are missing', () => {
      const markdown = `This is the main content.

#### Question Order
1`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'proof-reorder',
      };

      expect(() => ProofReorderBlockData.fromMarkdown(blockRaw)).toThrow(
        'Parts cannot be empty for block ID: test-id',
      );
    });

    it('should throw error when question order is missing', () => {
      const markdown = `This is the main content.

#### Part 1
First part content`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'proof-reorder',
      };

      expect(() => ProofReorderBlockData.fromMarkdown(blockRaw)).toThrow(
        'Question order is required for block ID: test-id',
      );
    });

    it('should throw error when part count and question order count mismatch', () => {
      const markdown = `This is the main content.

#### Part 1
First part content

#### Part 2
Second part content

#### Question Order
1`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'proof-reorder',
      };

      expect(() => ProofReorderBlockData.fromMarkdown(blockRaw)).toThrow(
        'Number of parts (2) does not match the length of question order (1) for block ID: test-id',
      );
    });
  });

  describe('getText', () => {
    it('should return formatted text content', () => {
      const block = new ProofReorderBlockData('test-id', 'Main content', {
        orderItems: [
          { id: '1', content: 'First part' },
          { id: '2', content: 'Second part' },
        ],
        questionOrder: '2,1',
      });

      const text = block.getText();
      expect(text).toBe(
        'Proof:\n\nMain content\n\n' + 'part-1:\nFirst part\n\n' + 'part-2:\nSecond part\n\n',
      );
    });

    it('should handle empty content', () => {
      const block = new ProofReorderBlockData('test-id', '', {
        orderItems: [{ id: '1', content: 'First part' }],
        questionOrder: '1',
      });

      const text = block.getText();
      expect(text).toBe('Proof:\n\n\n\n' + 'part-1:\nFirst part\n\n');
    });
  });

  describe('compatibility functions', () => {
    it('should work with convertProofReorderMarkdown', () => {
      const markdown = `Main content

#### Part 1
First part

#### Question Order
1`;

      const markdownBlock: MarkdownBlock = {
        tag: 'proof-reorder',
        id: 'test-id',
        rawTokens: marked.lexer(markdown),
      };

      const result = convertProofReorderMarkdown(markdownBlock);

      expect(result).toBeInstanceOf(ProofReorderBlockData);
      expect(result).toMatchObject({
        id: 'test-id',
        type: ProofReorderType,
      });
    });
  });
});
