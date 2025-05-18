import { marked } from 'marked';
import { describe, it, expect } from 'vitest';

import { type MarkdownBlock } from '../convert-markdown-helper';
import { ParaBlockData, ParaType } from './para-block';

describe('ParaBlockData', () => {
  describe('fromMarkdown', () => {
    it('should convert markdown block to para block', () => {
      const markdownContent = 'Test content';
      const tokens = marked.lexer(markdownContent);

      const markdownBlock: MarkdownBlock = {
        tag: 'para',
        id: 'test-id',
        rawTokens: tokens,
      };

      const result = ParaBlockData.fromMarkdown(markdownBlock);

      expect(result).toMatchObject({
        id: 'test-id',
        content: 'Test content',
        type: ParaType,
      });
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle markdown block with name', () => {
      const markdownContent = '#### content\nTest content';
      const tokens = marked.lexer(markdownContent);

      const markdownBlock: MarkdownBlock = {
        tag: 'para',
        name: 'Test Name',
        id: 'test-id',
        rawTokens: tokens,
      };

      const result = ParaBlockData.fromMarkdown(markdownBlock);

      expect(result).toMatchObject({
        id: 'test-id',
        content: 'Test content',
        type: ParaType,
      });
    });

    it('should throw error if markdown content is empty', () => {
      const markdownContent = ''; // Empty content
      const tokens = marked.lexer(markdownContent);
      const markdownBlock: MarkdownBlock = {
        tag: 'para',
        id: 'empty-md-id',
        rawTokens: tokens,
      };
      expect(() => ParaBlockData.fromMarkdown(markdownBlock)).toThrow(
        'Content cannot be empty for block ID: empty-md-id'
      );
    });

    it('should throw error if markdown content is only whitespace', () => {
      const markdownContent = '    '; // Whitespace content
      const tokens = marked.lexer(markdownContent);
      const markdownBlock: MarkdownBlock = {
        tag: 'para',
        id: 'whitespace-md-id',
        rawTokens: tokens,
      };
      expect(() => ParaBlockData.fromMarkdown(markdownBlock)).toThrow(
        'Content cannot be empty for block ID: whitespace-md-id'
      );
    });

    it('should throw error if content property is empty', () => {
      const markdownContent = '#### content\n'; // Empty content property
      const tokens = marked.lexer(markdownContent);
      const markdownBlock: MarkdownBlock = {
        tag: 'para',
        id: 'empty-prop-id',
        rawTokens: tokens,
      };
      expect(() => ParaBlockData.fromMarkdown(markdownBlock)).toThrow(
        'Content cannot be empty for block ID: empty-prop-id'
      );
    });

    it('should throw error if content property is only whitespace', () => {
      const markdownContent = '#### content\n  \n '; // Whitespace content property
      const tokens = marked.lexer(markdownContent);
      const markdownBlock: MarkdownBlock = {
        tag: 'para',
        id: 'whitespace-prop-id',
        rawTokens: tokens,
      };
      expect(() => ParaBlockData.fromMarkdown(markdownBlock)).toThrow(
        'Content cannot be empty for block ID: whitespace-prop-id'
      );
    });
  });

  describe('getText', () => {
    it('should return the content', () => {
      const block = new ParaBlockData('test-id', 'Test content');
      expect(block.getText()).toBe('Test content');
    });
  });
});
