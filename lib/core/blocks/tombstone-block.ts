import { type BlockSchema } from '../schemas';
import { type MarkdownBlock } from '../convert-markdown-helper';

export const Tombstone = {
  stone: '🪦',
  heart: '❤️',
  flower: '🌼',
  square: '□',
} as const;

export type Tombstone = keyof typeof Tombstone;

export const TombstoneType = 'TOMBSTONE';

export class TombstoneBlockData implements BlockSchema {
  readonly type = 'TOMBSTONE';
  constructor(
    public id: string,
    public content: string = '',
    public updatedAt: Date = new Date(),
  ) {}

  getText(): string {
    return '--- Proof End ---';
  }

  static fromMarkdown(block: MarkdownBlock): BlockSchema {
    return new TombstoneBlockData(block.id);
  }

  static validate(block: TombstoneBlockData): void {
    if (!block.id) {
      throw new Error('ID is required');
    }
  }
}
