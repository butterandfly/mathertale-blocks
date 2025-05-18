'use client';

import { MarkdownContent } from './MarkdownContent';
import { BlockStatus, type BlockSchema } from '../core/schemas';
import { HighlightBox } from './HighlightBox';
import { BlockProgressControl } from './BlockProgressControl';
import { 
  DefinitionType, 
  TheoremType, 
  PropositionType, 
  RemarkType, 
  LemmaType,
  type NotedBlockData 
} from '../core/blocks/noted-block';

export interface NotedBlockProps {
  data: NotedBlockData;
  status: BlockStatus;
  tag: string;
  theme: 'blue' | 'green' | 'amber' | 'purple' | 'gray';
  onContinue: (data: NotedBlockData) => Promise<void>;
}

export function NotedBlock({
  data,
  status,
  tag,
  theme,
  onContinue,
}: NotedBlockProps) {
  // const [showSaved, setShowSaved] = useState(false);
  const fullContent = `### ${data.name}\n\n${data.content}`;

  const handleContinue = async () => {
    await onContinue(data);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <HighlightBox theme={theme} tag={tag}>
          <MarkdownContent content={fullContent} />
        </HighlightBox>

        {/* Bottom-right saved notification */}
        {/* <div
          className={cn(
            "absolute bottom-4 right-4 transition-all duration-300",
            "flex items-center gap-2 px-3 py-2",
            "bg-green-500 text-white rounded-md shadow-lg",
            showSaved
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0 pointer-events-none"
          )}
        >
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Saved</span>
        </div> */}
      </div>

        <BlockProgressControl 
        status={status}
        onContinue={() => handleContinue()}
        />
    </div>
  );
}

/**
 * Wrapper functions for rendering different block types.
 * Adjust property names and theme colors according to your needs.
 */

export function renderDefinitionBlock(
  block: BlockSchema,
  status: BlockStatus,
  onContinue: (data: NotedBlockData) => Promise<void>
) {
  return (
    <NotedBlock
      key={block.id}
      data={block as NotedBlockData}
      status={status}
      tag={DefinitionType}
      theme="blue"
      onContinue={onContinue}
    />
  );
}

export function renderTheoremBlock(
  block: BlockSchema,
  status: BlockStatus,
  onContinue: (data: NotedBlockData) => Promise<void>
) {
  return (
    <NotedBlock
      key={block.id}
      data={block as NotedBlockData}
      tag={TheoremType}
      theme="green"
      status={status}
      onContinue={onContinue}
    />
  );
}

export function renderPropositionBlock(
  block: BlockSchema,
  status: BlockStatus,
  onContinue: (data: NotedBlockData) => Promise<void>
) {
  return (
    <NotedBlock
      key={block.id}
      data={block as NotedBlockData}
      tag={PropositionType}
      theme="green"
      status={status}
      onContinue={onContinue}
    />
  );
}

export function renderLemmaBlock(
  block: BlockSchema,
  status: BlockStatus,
  onContinue: (data: NotedBlockData) => Promise<void>
) {
  return (
    <NotedBlock
      key={block.id}
      data={block as NotedBlockData}
      tag={LemmaType}
      theme="green"
      status={status}
      onContinue={onContinue}
    />
  );
}

export function renderRemarkBlock(
  block: BlockSchema,
  status: BlockStatus,
  onContinue: (data: NotedBlockData) => Promise<void>
) {
  return (
    <NotedBlock
      key={block.id}
      data={block as NotedBlockData}
      tag={RemarkType}
      theme="amber"
      status={status}
      onContinue={onContinue}
    />
  );
}

