import { MarkdownContent } from './MarkdownContent';
import { HighlightBox } from './HighlightBox';
import { BlockProgressControl } from './BlockProgressControl';
import {
  DefinitionType,
  TheoremType,
  PropositionType,
  RemarkType,
  LemmaType,
  type NotedBlockData,
} from '../core/blocks/noted-block';
import { type BaseBlockProps } from './components';

export interface NotedBlockProps extends BaseBlockProps<NotedBlockData> {
  tag: string;
  theme: 'blue' | 'green' | 'amber' | 'purple' | 'gray';
}

export function NotedBlock({ data, status, tag, theme, onContinue, readonly }: NotedBlockProps) {
  const fullContent = `### ${data.name}\n\n${data.content}`;

  const handleContinue = async () => {
    await onContinue(data);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <HighlightBox
          theme={theme}
          tag={tag}
        >
          <MarkdownContent content={fullContent} />
        </HighlightBox>
      </div>

      {!readonly && (
        <BlockProgressControl
          status={status}
          onContinue={() => handleContinue()}
        />
      )}
    </div>
  );
}

/**
 * Wrapper functions for rendering different block types.
 * Adjust property names and theme colors according to your needs.
 */

export function renderDefinitionBlock({
  data,
  status,
  onContinue,
  readonly,
}: BaseBlockProps<NotedBlockData>) {
  return (
    <NotedBlock
      key={data.id}
      data={data}
      status={status}
      tag={DefinitionType}
      theme="blue"
      onContinue={onContinue}
      readonly={readonly}
    />
  );
}

export function renderTheoremBlock({
  data,
  status,
  onContinue,
  readonly,
}: BaseBlockProps<NotedBlockData>) {
  return (
    <NotedBlock
      key={data.id}
      data={data}
      tag={TheoremType}
      theme="green"
      status={status}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
}

export function renderPropositionBlock({
  data,
  status,
  onContinue,
  readonly,
}: BaseBlockProps<NotedBlockData>) {
  return (
    <NotedBlock
      key={data.id}
      data={data}
      tag={PropositionType}
      theme="green"
      status={status}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
}

export function renderLemmaBlock({
  data,
  status,
  onContinue,
  readonly,
}: BaseBlockProps<NotedBlockData>) {
  return (
    <NotedBlock
      key={data.id}
      data={data}
      tag={LemmaType}
      theme="green"
      status={status}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
}

export function renderRemarkBlock({
  data,
  status,
  onContinue,
  readonly,
}: BaseBlockProps<NotedBlockData>) {
  return (
    <NotedBlock
      key={data.id}
      data={data}
      tag={RemarkType}
      theme="amber"
      status={status}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
}
