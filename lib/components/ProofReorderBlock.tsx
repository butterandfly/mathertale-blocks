import { useMemo, useState } from 'react';
import { type BlockSchema as Block, type BlockStatus } from '../core/schemas';
import { SubmitControl } from './SubmitControl';
import { ReorderContent } from './ReorderContent';
import { MarkdownContent } from './MarkdownContent';
import { type OrderItem, type ProofReorderBlockData } from '../core/blocks/proof-reorder-block';
import { BlockHeadline } from './BlockHeadline';
import type { BaseQuestionBlockProps } from './components';
import { BlockProgressControl } from './BlockProgressControl';

const questionMarkContent = 'Drag the items to reorder the proof';

export interface ProofReorderBlockProps extends BaseQuestionBlockProps<ProofReorderBlockData> {
  submittedAnswer?: string;
  readonly?: boolean;
}

export function ProofReorderBlock({
  data,
  status,
  onSubmit,
  onContinue,
  submittedAnswer,
  readonly,
}: ProofReorderBlockProps) {
  const { orderItems, questionOrder } = data.questionData;

  let initialItems: OrderItem[] = [];
  if (readonly) {
    // In readonly mode, always show items in correct order
    initialItems = orderItems;
  } else if (submittedAnswer === undefined) {
    initialItems = reorderItems(orderItems, questionOrder);
  } else {
    initialItems = reorderItems(orderItems, submittedAnswer as string);
  }

  const [currentItems, setCurrentItems] = useState<typeof initialItems>(initialItems);

  // Use useMemo and markdowns to build the explanation
  const explanation = useMemo(() => {
    const contents = data.questionData.orderItems.map((item) => item.content);
    return contents.join('\n');
  }, [data.questionData.orderItems]);

  const isCorrect = useMemo(() => {
    return currentItems.every((item, index) => item.id === orderItems[index].id);
  }, [currentItems, orderItems]);

  let highlight: 'none' | 'green' | 'blue' | 'red' = 'none';
  if (submittedAnswer !== undefined) {
    highlight = isCorrect ? 'green' : 'red';
  }

  const handleSubmit = async () => {
    // 将当前顺序转换为答案字符串（使用 id 列表）
    const submittedAnswer = currentItems.map((item) => item.id).join(',');
    await onSubmit(data, submittedAnswer);
  };

  return (
    <div className="space-y-6">
      <BlockHeadline
        title="Proof"
        questionMarkContent={questionMarkContent}
      />

      <MarkdownContent content={data.content} />

      <ReorderContent
        items={currentItems}
        disabled={submittedAnswer !== undefined || readonly === true}
        highlight={highlight}
        onOrderChange={(newItems) => {
          setCurrentItems(newItems);
        }}
      />

      {!readonly && (
        <SubmitControl
          isSubmitted={submittedAnswer !== undefined}
          isCorrect={isCorrect}
          isSubmitEnabled={true}
          onSubmit={handleSubmit}
        />
      )}

      {(readonly || submittedAnswer !== undefined) && explanation && (
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <h3 className="font-medium text-blue-900">The Complete Proof</h3>
          <MarkdownContent content={explanation} />
        </div>
      )}

      {!readonly && submittedAnswer !== undefined && (
        <BlockProgressControl
          status={status}
          onContinue={() => onContinue(data)}
        />
      )}
    </div>
  );
}

export function renderProofReorderBlock(
  block: Block,
  status: BlockStatus,
  onContinue: (data: ProofReorderBlockData, continueValue?: string) => Promise<void>,
  submittedAnswer?: string,
  onSubmit?: (data: ProofReorderBlockData, submittedAnswer: string) => Promise<void>,
  readonly?: boolean,
) {
  return (
    <ProofReorderBlock
      key={block.id}
      data={block as ProofReorderBlockData}
      status={status}
      onSubmit={onSubmit!}
      onContinue={onContinue}
      submittedAnswer={submittedAnswer}
      readonly={readonly}
    />
  );
}

/**
 * 根据 order 重新排序 items
 * @param items
 * @param order Example: "1,2,3"
 * @returns
 */
export function reorderItems(items: OrderItem[], order: string) {
  return order.split(',').map((o) => items.find((m) => m.id === o)) as OrderItem[];
}
