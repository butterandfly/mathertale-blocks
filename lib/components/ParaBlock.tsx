import { MarkdownContent } from './MarkdownContent';
import { type BlockSchema as Block, type BlockStatus } from '../core/schemas';
import { BlockProgressControl } from './BlockProgressControl';
import { type ParaBlockData } from '../core/blocks/para-block';

interface BlockProgress {
  blockId: string;
  status: BlockStatus;
}

export interface ParaBlockProps {
  data: ParaBlockData;
  blockProgress: BlockProgress;
  onContinue: (data: ParaBlockData) => Promise<void>;
}

export function renderParaBlock(
  block: Block,
  blockProgress: BlockProgress,
  onContinue: (data: ParaBlockData) => Promise<void>,
) {
  return (
    <ParaBlock
      key={block.id}
      data={block as ParaBlockData}
      blockProgress={blockProgress}
      onContinue={onContinue}
    />
  );
}

export function ParaBlock({ 
  data,
  blockProgress,
  onContinue,
}: ParaBlockProps) {
  return (
    <div className="space-y-4">
      <MarkdownContent content={data.content} />
      <BlockProgressControl 
        status={blockProgress.status}
        onContinue={() => onContinue(data)}
      />
    </div>
  );
} 