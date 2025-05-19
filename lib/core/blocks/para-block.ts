import { type MarkdownBlock, extractProperties } from '../convert-markdown-helper';
import { type BlockSchema } from '../schemas';

export const ParaType = 'PARA' as const;

export class ParaBlockData implements BlockSchema {
  readonly type = ParaType;

  constructor(
    public id: string,
    public content: string,
    public headline: string = '',
    public updatedAt: Date = new Date(),
  ) {}

  getText(): string {
    return this.content;
  }

  static validate(block: ParaBlockData): void {
    if (!block.content || block.content.trim() === '') {
      throw new Error(`Content cannot be empty for block ID: ${block.id}`);
    }
  }

  // 从 Markdown 创建实例
  // `content` can not be empty
  // Example:
  //
  // Content.
  //
  // #### Headline
  // Some title.
  // ```
  static fromMarkdown(block: MarkdownBlock): BlockSchema {
    const { content, properties } = extractProperties(block.rawTokens);

    const newBlock = new ParaBlockData(
      block.id,
      properties.content || content || '',
      properties.headline || '',
    );
    ParaBlockData.validate(newBlock); // Use ParaBlockData.validate instead of this.validate
    return newBlock;
  }
}

export const convertParaMarkdown = ParaBlockData.fromMarkdown;
