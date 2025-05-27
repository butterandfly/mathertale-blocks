import { MarkdownContent } from './MarkdownContent';
import { BlockProgressControl } from './BlockProgressControl';
import { type ParaBlockData } from '../core/blocks/para-block';
import { type BaseBlockProps, type BlockRenderer } from './components';
import { BlockHeadline } from './BlockHeadline';

type ParaBlockProps = BaseBlockProps<ParaBlockData>;

export const renderParaBlock: BlockRenderer<ParaBlockData> = ({
  data,
  status,
  onContinue,
  readonly,
}) => {
  return (
    <ParaBlock
      key={data.id}
      data={data as ParaBlockData}
      status={status}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
};

export function ParaBlock({ data, status, onContinue, readonly }: ParaBlockProps) {
  return (
    <div className="space-y-4">
      {data.headline && <BlockHeadline title={data.headline} />}
      <MarkdownContent content={data.content} />
      {!readonly && (
        <BlockProgressControl
          status={status}
          onContinue={() => onContinue(data)}
        />
      )}
    </div>
  );
}
