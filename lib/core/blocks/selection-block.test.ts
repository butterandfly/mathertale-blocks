import { marked } from 'marked';
import { expect, describe, it } from 'vitest';

import { type MarkdownBlock } from '../convert-markdown-helper';
import { SelectionBlockData, SelectionType } from './selection-block';

describe('SelectionBlockData', () => {
  describe('fromMarkdown', () => {
    it('should convert markdown to selection block', () => {
      const markdown = `This is the main content.

#### Choices
a: First choice
b: Second choice
c: Third choice
d: Fourth choice

#### Answer
a, c, d

#### Explanation
This is the explanation.`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      const result = SelectionBlockData.fromMarkdown(blockRaw);

      expect(result).toMatchObject({
        id: 'test-id',
        content: 'This is the main content.',
        type: SelectionType,
        questionData: {
          choices: [
            { key: 'a', content: 'First choice' },
            { key: 'b', content: 'Second choice' },
            { key: 'c', content: 'Third choice' },
            { key: 'd', content: 'Fourth choice' },
          ],
          answer: ['a', 'c', 'd'],
          explanation: 'This is the explanation.',
        },
      });
    });

    it('should handle single answer', () => {
      const markdown = `This is the main content.

#### Choices
a: First choice
b: Second choice
c: Third choice

#### Answer
b

#### Explanation
This is the explanation.`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      const result = SelectionBlockData.fromMarkdown(blockRaw);

      expect(result).toMatchObject({
        id: 'test-id',
        content: 'This is the main content.',
        type: SelectionType,
        questionData: {
          choices: [
            { key: 'a', content: 'First choice' },
            { key: 'b', content: 'Second choice' },
            { key: 'c', content: 'Third choice' },
          ],
          answer: ['b'],
          explanation: 'This is the explanation.',
        },
      });
    });

    it('should handle markdown with name', () => {
      const markdown = `This is the main content.

#### Choices
a: First choice
b: Second choice

#### Answer
a, b

#### Explanation
This is the explanation.`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        name: 'Test Name',
        rawTokens: tokens,
        tag: 'selection',
      };

      const result = SelectionBlockData.fromMarkdown(blockRaw);

      expect(result).toMatchObject({
        id: 'test-id',
        name: 'Test Name',
        content: 'This is the main content.',
        type: SelectionType,
        questionData: {
          choices: [
            { key: 'a', content: 'First choice' },
            { key: 'b', content: 'Second choice' },
          ],
          answer: ['a', 'b'],
          explanation: 'This is the explanation.',
        },
      });
    });

    it('should handle all choices selected', () => {
      const markdown = `Question content.

#### Choices
a: Choice A
b: Choice B
c: Choice C

#### Answer
a, b, c

#### Explanation
All choices are correct.`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      const result = SelectionBlockData.fromMarkdown(blockRaw);

      expect(result.questionData.answer).toEqual(['a', 'b', 'c']);
    });

    it('should throw error when choices are missing', () => {
      const markdown = `This is the main content.

#### Answer
a, b

#### Explanation
This is the explanation.`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      expect(() => SelectionBlockData.fromMarkdown(blockRaw)).toThrow(
        'Choices cannot be empty for block ID: test-id',
      );
    });

    it('should throw error when answer is missing', () => {
      const markdown = `This is the main content.

#### Choices
a: First choice
b: Second choice

#### Explanation
Test explanation`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      expect(() => SelectionBlockData.fromMarkdown(blockRaw)).toThrow(
        'Answer must contain at least 1 key for block ID: test-id',
      );
    });

    it('should throw error when explanation is missing', () => {
      const markdown = `This is the main content.

#### Choices
a: First choice
b: Second choice

#### Answer
a, b`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      expect(() => SelectionBlockData.fromMarkdown(blockRaw)).toThrow(
        'Explanation is required for block ID: test-id',
      );
    });

    it('should throw error when answer is empty', () => {
      const markdown = `This is the main content.

#### Choices
a: First choice
b: Second choice
c: Third choice

#### Answer


#### Explanation
Test explanation`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      expect(() => SelectionBlockData.fromMarkdown(blockRaw)).toThrow(
        'Answer must contain at least 1 key for block ID: test-id',
      );
    });

    it('should throw error when answer key does not exist in choices', () => {
      const markdown = `This is the main content.

#### Choices
a: First choice
b: Second choice

#### Answer
a, c

#### Explanation
Test explanation`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      expect(() => SelectionBlockData.fromMarkdown(blockRaw)).toThrow(
        'Answer key "c" does not exist in choices (a, b) for block ID: test-id',
      );
    });

    it('should handle duplicate keys in answer gracefully', () => {
      const markdown = `This is the main content.

#### Choices
a: First choice
b: Second choice
c: Third choice

#### Answer
a, b, a, c

#### Explanation
Test explanation`;

      const tokens = marked.lexer(markdown);
      const blockRaw: MarkdownBlock = {
        id: 'test-id',
        rawTokens: tokens,
        tag: 'selection',
      };

      const result = SelectionBlockData.fromMarkdown(blockRaw);
      expect(result.questionData.answer).toEqual(['a', 'b', 'c']);
    });
  });

  describe('getText', () => {
    it('should return formatted text content', () => {
      const block = new SelectionBlockData('test-id', 'Main content', {
        choices: [
          { key: 'a', content: 'First choice' },
          { key: 'b', content: 'Second choice' },
          { key: 'c', content: 'Third choice' },
        ],
        answer: ['a', 'c'],
        explanation: 'Test explanation',
      });

      const text = block.getText();
      expect(text).toBe(
        'Main content\n\n' +
          'choices:\n' +
          'a: First choice\n' +
          'b: Second choice\n' +
          'c: Third choice\n\n' +
          'answer:\n' +
          'a, c\n\n' +
          'explanation:\n' +
          'Test explanation',
      );
    });

    it('should handle single answer', () => {
      const block = new SelectionBlockData('test-id', 'Main content', {
        choices: [
          { key: 'a', content: 'First choice' },
          { key: 'b', content: 'Second choice' },
        ],
        answer: ['b'],
        explanation: 'Test explanation',
      });

      const text = block.getText();
      expect(text).toBe(
        'Main content\n\n' +
          'choices:\n' +
          'a: First choice\n' +
          'b: Second choice\n\n' +
          'answer:\n' +
          'b\n\n' +
          'explanation:\n' +
          'Test explanation',
      );
    });

    it('should handle empty content', () => {
      const block = new SelectionBlockData('test-id', '', {
        choices: [{ key: 'a', content: 'First choice' }],
        answer: ['a'],
        explanation: 'Test explanation',
      });

      const text = block.getText();
      expect(text).toBe(
        '\n\n' +
          'choices:\n' +
          'a: First choice\n\n' +
          'answer:\n' +
          'a\n\n' +
          'explanation:\n' +
          'Test explanation',
      );
    });

    it('should handle multiple answers', () => {
      const block = new SelectionBlockData('test-id', 'Question', {
        choices: [
          { key: 'a', content: 'Choice A' },
          { key: 'b', content: 'Choice B' },
          { key: 'c', content: 'Choice C' },
          { key: 'd', content: 'Choice D' },
        ],
        answer: ['a', 'b', 'c', 'd'],
        explanation: 'All are correct',
      });

      const text = block.getText();
      expect(text).toBe(
        'Question\n\n' +
          'choices:\n' +
          'a: Choice A\n' +
          'b: Choice B\n' +
          'c: Choice C\n' +
          'd: Choice D\n\n' +
          'answer:\n' +
          'a, b, c, d\n\n' +
          'explanation:\n' +
          'All are correct',
      );
    });
  });

  describe('validate', () => {
    it('should pass validation for valid block', () => {
      const block = new SelectionBlockData('test-id', 'Content', {
        choices: [
          { key: 'a', content: 'Choice A' },
          { key: 'b', content: 'Choice B' },
        ],
        answer: ['a'],
        explanation: 'Explanation',
      });

      expect(() => SelectionBlockData.validate(block)).not.toThrow();
    });

    it('should throw error for empty choices', () => {
      const block = new SelectionBlockData('test-id', 'Content', {
        choices: [],
        answer: ['a'],
        explanation: 'Explanation',
      });

      expect(() => SelectionBlockData.validate(block)).toThrow(
        'Choices cannot be empty for block ID: test-id',
      );
    });

    it('should throw error for empty answer', () => {
      const block = new SelectionBlockData('test-id', 'Content', {
        choices: [{ key: 'a', content: 'Choice A' }],
        answer: [],
        explanation: 'Explanation',
      });

      expect(() => SelectionBlockData.validate(block)).toThrow(
        'Answer must contain at least 1 key for block ID: test-id',
      );
    });

    it('should throw error for missing explanation', () => {
      const block = new SelectionBlockData('test-id', 'Content', {
        choices: [{ key: 'a', content: 'Choice A' }],
        answer: ['a'],
        explanation: '',
      });

      expect(() => SelectionBlockData.validate(block)).toThrow(
        'Explanation is required for block ID: test-id',
      );
    });

    it('should throw error for invalid answer key', () => {
      const block = new SelectionBlockData('test-id', 'Content', {
        choices: [{ key: 'a', content: 'Choice A' }],
        answer: ['b'],
        explanation: 'Explanation',
      });

      expect(() => SelectionBlockData.validate(block)).toThrow(
        'Answer key "b" does not exist in choices (a) for block ID: test-id',
      );
    });
  });
});
