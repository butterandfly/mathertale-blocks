import { MarkdownContent } from './MarkdownContent';
import { type BlockStatus } from '../core/schemas';
import { BlockProgressControl } from './BlockProgressControl';
import { type ParaBlockData } from '../core/blocks/para-block';
import { type BaseBlockProps, type BlockRenderer } from './components';
import { BlockHeadline } from './BlockHeadline';

export interface ParaBlockProps extends BaseBlockProps<ParaBlockData> {
  data: ParaBlockData;
  status: BlockStatus;
  onContinue: (data: ParaBlockData) => Promise<void>;
}

export const renderParaBlock: BlockRenderer<ParaBlockData> = ({ data, status, onContinue }) => {
  return (
    <ParaBlock
      key={data.id}
      data={data as ParaBlockData}
      status={status}
      onContinue={onContinue}
    />
  );
};

export function ParaBlock({ data, status, onContinue }: ParaBlockProps) {
  return (
    <div className="space-y-4">
      {data.headline && <BlockHeadline title={data.headline} />}
      <MarkdownContent content={data.content} />
      <BlockProgressControl
        status={status}
        onContinue={() => onContinue(data)}
      />
    </div>
  );
}
