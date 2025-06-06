import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { DraggableMarkdownItem } from './DraggableMarkdownItem';
import { DropBox, type DropBoxColor } from './DropBox';
import { HighlightBox } from './HighlightBox';
import { MarkdownContent } from './MarkdownContent';
import { type BlockStatus } from '../core/schemas';
import { BlockProgressControl } from './BlockProgressControl';
import { SubmitControl } from './SubmitControl';
import { MousePointerClick } from 'lucide-react';
import { type SelectionChoice, type SelectionBlockData } from '../core/blocks/selection-block';
import type { QuestionBlockRenderer } from './components';

const questionMarkContent = `Drag the correct options into the selection box. Multiple options can be selected.`;

export interface SelectionBlockProps {
  data: SelectionBlockData;
  status: BlockStatus;
  submittedAnswer?: string;
  // submittedAnswer example: "a,c,d"
  onSubmit: (data: SelectionBlockData, submittedAnswer: string) => Promise<void>;
  onContinue: (data: SelectionBlockData) => Promise<void>;
  readonly?: boolean;
}

// Enhanced SelectionChoice with currentDropBoxId
interface EnhancedSelectionChoice extends SelectionChoice {
  currentDropBoxId?: string;
}

export function SelectionBlock({
  data,
  status,
  submittedAnswer,
  onSubmit,
  onContinue,
  readonly,
}: SelectionBlockProps) {
  // 将 choices 转换为 EnhancedSelectionChoice 数组
  const initialItems = useMemo(() => {
    const items = data.questionData.choices.map((choice: SelectionChoice) => ({
      ...choice,
      currentDropBoxId: undefined,
    }));

    // 在只读模式下，显示正确答案
    if (readonly) {
      const correctAnswer = data.questionData.answer;
      return items.map((item) => {
        if (correctAnswer.includes(item.key)) {
          return { ...item, currentDropBoxId: 'selection-box' };
        }
        return item;
      });
    }

    // 如果已经有提交的答案，将对应的选项放入选择框
    if (submittedAnswer) {
      const submittedKeys = submittedAnswer.split(',').map((key) => key.trim());
      return items.map((item) => {
        if (submittedKeys.includes(item.key)) {
          return { ...item, currentDropBoxId: 'selection-box' };
        }
        return item;
      });
    }

    return items;
  }, [data.questionData.choices, submittedAnswer, readonly, data.questionData.answer]);

  const [items, setItems] = useState<EnhancedSelectionChoice[]>(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // 从 blockProgress 中获取答案和解释
  const { explanation, isCorrect } = useMemo(() => {
    // 在只读模式下，总是显示解释并标记为正确
    if (readonly) {
      return {
        explanation: data.questionData.explanation,
        isCorrect: true,
      };
    }

    if (!submittedAnswer) {
      return { explanation: null, isCorrect: false };
    }

    // 检查答案是否正确
    const correctAnswer = data.questionData.answer;
    const submittedAnswerArray = submittedAnswer.split(',').map((key) => key.trim());

    const isEqual = haveSameElements(correctAnswer, submittedAnswerArray);

    return {
      explanation: data.questionData.explanation,
      isCorrect: isEqual,
    };
  }, [submittedAnswer, data.questionData, readonly]);

  // 设置一个 DropBox
  const dropBox = useMemo(() => {
    // 在只读模式下，总是显示绿色（正确答案）
    if (readonly) {
      return { id: 'selection-box', color: 'green' as DropBoxColor };
    }

    // 如果已提交答案，根据正确与否设置颜色
    if (submittedAnswer !== undefined) {
      const boxColor = isCorrect ? 'green' : 'red';
      return { id: 'selection-box', color: boxColor as DropBoxColor };
    }

    return { id: 'selection-box', color: 'blue' as DropBoxColor };
  }, [submittedAnswer, isCorrect, readonly]);

  // 配置传感器
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 处理拖拽开始事件
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    // 如果已经提交或在只读模式下，不允许拖拽
    if (submittedAnswer !== undefined || readonly) {
      return;
    }

    const { active, over } = event;

    if (!over) {
      // 如果没有拖到任何地方，检查是否是从 dropbox 中拖出
      const draggedItemIndex = items.findIndex((item) => item.key === active.id);
      if (draggedItemIndex !== -1 && items[draggedItemIndex].currentDropBoxId) {
        // 如果是从 dropbox 中拖出，将其移回可用区域
        const updatedItems = [...items];
        updatedItems[draggedItemIndex] = {
          ...updatedItems[draggedItemIndex],
          currentDropBoxId: undefined,
        };
        setItems(updatedItems);
        setError(null);
      }
      return;
    }

    // 检查是否拖到了 dropbox 区域外
    if (over.id !== dropBox.id) {
      // 如果拖到了 dropbox 区域外，检查是否是从 dropbox 中拖出
      const draggedItemIndex = items.findIndex((item) => item.key === active.id);
      if (draggedItemIndex !== -1 && items[draggedItemIndex].currentDropBoxId) {
        // 如果是从 dropbox 中拖出，将其移回可用区域
        const updatedItems = [...items];
        updatedItems[draggedItemIndex] = {
          ...updatedItems[draggedItemIndex],
          currentDropBoxId: undefined,
        };
        setItems(updatedItems);
        setError(null);
      }
      return;
    }

    // 找到被拖动的项目
    const draggedItemIndex = items.findIndex((item) => item.key === active.id);
    if (draggedItemIndex === -1) return;

    // 更新项目的 dropbox
    const updatedItems = [...items];

    // 根据drop的位置来决定行为
    if (over.id === dropBox.id) {
      // 如果拖到了选择框，将其放入选择框
      updatedItems[draggedItemIndex] = {
        ...updatedItems[draggedItemIndex],
        currentDropBoxId: dropBox.id,
      };
    } else {
      // 如果拖到了选择框外，将其移出选择框
      updatedItems[draggedItemIndex] = {
        ...updatedItems[draggedItemIndex],
        currentDropBoxId: undefined,
      };
    }

    setItems(updatedItems);
    setError(null);
  };

  // 处理提交
  const handleSubmit = async () => {
    // 检查是否至少有一个选项被选择
    const selectedItems = items.filter((item) => item.currentDropBoxId === dropBox.id);

    if (selectedItems.length === 0) {
      setError('Please select at least one option');
      return;
    }

    // 构建答案字符串，例如 "a,c,d"
    const submittedAnswer = selectedItems.map((item) => item.key).join(',');
    await onSubmit(data, submittedAnswer);
  };

  // 获取不在选择框中的项目
  const availableItems = items.filter((item) => !item.currentDropBoxId);

  // 获取在选择框中的项目
  const selectedItems = items.filter((item) => item.currentDropBoxId === dropBox.id);

  // 检查是否已提交
  const isSubmitted = submittedAnswer !== undefined;

  // 检查是否可以提交
  const canSubmit = selectedItems.length > 0;

  return (
    <div className="space-y-6">
      <HighlightBox
        theme="gray"
        withBackground={false}
        tag="Selection"
        questionMarkContent={questionMarkContent}
        className="space-y-6"
      >
        <MarkdownContent content={data.content} />

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <div className="space-y-6">
            {/* 选择框 */}
            <div className="flex flex-col items-center w-full">
              <div className="mb-2 font-medium flex items-center gap-2">
                <MousePointerClick
                  size={18}
                  className="text-gray-600"
                />
                Selected Options
              </div>
              <div className="w-full">
                <DropBox
                  {...dropBox}
                  disabled={isSubmitted || readonly}
                  className="min-h-[120px]"
                >
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {selectedItems.map((item) => (
                      <DraggableMarkdownItem
                        key={item.key}
                        id={item.key}
                        content={item.content}
                        disabled={isSubmitted || readonly}
                      />
                    ))}
                  </div>
                  {selectedItems.length === 0 && !isSubmitted && !readonly && (
                    <div className="text-gray-400 text-center py-8">
                      Drag options here to select them
                    </div>
                  )}
                </DropBox>
              </div>
            </div>

            {/* 可用的拖动项目，每行显示两个 */}
            {availableItems.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium text-gray-700">Available Options</div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {availableItems.map((item) => (
                    <DraggableMarkdownItem
                      key={item.key}
                      id={item.key}
                      content={item.content}
                      disabled={isSubmitted || readonly}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 错误提示 */}
            {error && !isSubmitted && <div className="text-red-500 text-sm mt-2">{error}</div>}

            {/* 提交控制 */}
            {!readonly && (
              <SubmitControl
                isSubmitted={isSubmitted}
                isCorrect={isCorrect}
                explanation={explanation ?? undefined}
                isSubmitEnabled={canSubmit && !isSubmitted}
                onSubmit={handleSubmit}
              />
            )}

            {/* 只读模式下的解释 */}
            {readonly && explanation && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium text-blue-900">Explanation</h3>
                <MarkdownContent content={explanation} />
              </div>
            )}
          </div>

          <DragOverlay>
            {activeId ? (
              <DraggableMarkdownItem
                id={activeId}
                content={items.find((item) => item.key === activeId)?.content || ''}
                disabled={false}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </HighlightBox>

      {/* 进度控制 */}
      {!readonly && isSubmitted && (
        <BlockProgressControl
          status={status}
          onContinue={() => onContinue(data)}
        />
      )}
    </div>
  );
}

export const renderSelectionBlock: QuestionBlockRenderer<SelectionBlockData> = ({
  data,
  status,
  onContinue,
  submittedAnswer,
  onSubmit,
  readonly,
}: SelectionBlockProps) => {
  return (
    <SelectionBlock
      key={data.id}
      data={data}
      status={status}
      submittedAnswer={submittedAnswer}
      onSubmit={onSubmit!}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
};

function haveSameElements<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }

  // Create a frequency map for array1
  const frequencyMap = new Map<T, number>();
  for (const item of array1) {
    frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
  }

  // Check if array2 has the same elements with the same frequency
  for (const item of array2) {
    const count = frequencyMap.get(item);
    if (!count) {
      return false;
    }
    frequencyMap.set(item, count - 1);
  }

  // Ensure all frequencies are zero
  for (const [, count] of frequencyMap) {
    if (count !== 0) {
      return false;
    }
  }

  return true;
}
