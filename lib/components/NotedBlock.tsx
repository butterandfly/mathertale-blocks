import { MarkdownContent } from './MarkdownContent';
import { HighlightBox } from './HighlightBox';
import { BlockProgressControl } from './BlockProgressControl';
import {
  DefinitionType,
  TheoremType,
  PropositionType,
  RemarkType,
  LemmaType,
  FactType,
  type NotedBlockData,
} from '../core/blocks/noted-block';
import { type BaseBlockProps, type BlockRenderer } from './components';

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

export const renderDefinitionBlock: BlockRenderer<NotedBlockData> = ({
  data,
  status,
  onContinue,
  readonly,
}) => {
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
};

export const renderTheoremBlock: BlockRenderer<NotedBlockData> = ({
  data,
  status,
  onContinue,
  readonly,
}) => {
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
};

export const renderPropositionBlock: BlockRenderer<NotedBlockData> = ({
  data,
  status,
  onContinue,
  readonly,
}) => {
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
};

export const renderLemmaBlock: BlockRenderer<NotedBlockData> = ({
  data,
  status,
  onContinue,
  readonly,
}) => {
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
};

export const renderRemarkBlock: BlockRenderer<NotedBlockData> = ({
  data,
  status,
  onContinue,
  readonly,
}) => {
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
};

export const renderFactBlock: BlockRenderer<NotedBlockData> = ({
  data,
  status,
  onContinue,
  readonly,
}) => {
  return (
    <NotedBlock
      key={data.id}
      data={data}
      tag={FactType}
      theme="green"
      status={status}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
};
