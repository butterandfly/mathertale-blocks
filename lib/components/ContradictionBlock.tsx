'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  type DragEndEvent,
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
import { type BlockSchema as Block, type BlockStatus } from '../core/schemas';
import { BlockProgressControl } from './BlockProgressControl';
import { SubmitControl } from './SubmitControl';
import { Swords } from 'lucide-react';
import {
  type ContradictionChoice,
  type ContradictionBlockData,
} from '../core/blocks/contradiction-block';

const questionMarkContent = `Drag the contradiction facts into the boxes. Selected facts should be:
- true, based on the assumption;
- contradicting to each other.`;

export interface ContradictionBlockProps {
  data: ContradictionBlockData;
  status: BlockStatus;
  submittedAnswer?: string;
  // submittedAnswer example: "a,b"
  onSubmit: (data: ContradictionBlockData, submittedAnswer: string) => Promise<void>;
  onContinue: (data: ContradictionBlockData) => Promise<void>;
  readonly?: boolean;
}

// Enhanced ContradictionChoice with currentDropBoxId
interface EnhancedContradictionChoice extends ContradictionChoice {
  currentDropBoxId?: string;
}

export function ContradictionBlock({
  data,
  status,
  submittedAnswer,
  onSubmit,
  onContinue,
  readonly,
}: ContradictionBlockProps) {
  // 将 choices 转换为 EnhancedContradictionChoice 数组
  const initialItems = useMemo(() => {
    const items = data.questionData.choices.map((choice: ContradictionChoice) => ({
      ...choice,
      currentDropBoxId: undefined,
    }));

    // 在只读模式下，显示正确答案
    if (readonly) {
      const correctAnswer = data.questionData.answer;
      const [box1Key, box2Key] = correctAnswer;

      return items.map((item) => {
        if (item.key === box1Key) {
          return { ...item, currentDropBoxId: 'box-1' };
        } else if (item.key === box2Key) {
          return { ...item, currentDropBoxId: 'box-2' };
        }
        return item;
      });
    }

    // 如果已经有提交的答案，将对应的选项放入对应的盒子
    if (submittedAnswer) {
      const [box1Key, box2Key] = submittedAnswer.split(',');

      return items.map((item) => {
        if (item.key === box1Key) {
          return { ...item, currentDropBoxId: 'box-1' };
        } else if (item.key === box2Key) {
          return { ...item, currentDropBoxId: 'box-2' };
        }
        return item;
      });
    }

    return items;
  }, [data.questionData.choices, submittedAnswer, readonly, data.questionData.answer]);

  const [items, setItems] = useState<EnhancedContradictionChoice[]>(initialItems);
  const [error, setError] = useState<string | null>(null);

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
    const answer = data.questionData.answer;
    const submittedAnswerArray = submittedAnswer.split(',');

    const isEqual = haveSameElements(answer, submittedAnswerArray);

    return {
      explanation: data.questionData.explanation,
      isCorrect: isEqual,
    };
  }, [submittedAnswer, data.questionData, readonly]);

  // 设置两个 DropBox，一个黄色一个紫色
  const dropBoxes = useMemo(() => {
    // 在只读模式下，总是显示绿色（正确答案）
    if (readonly) {
      return [
        { id: 'box-1', color: 'green' as DropBoxColor },
        { id: 'box-2', color: 'green' as DropBoxColor },
      ];
    }

    // 如果已提交答案，根据正确与否设置颜色
    if (submittedAnswer !== undefined) {
      const boxColor = isCorrect ? 'green' : 'red';
      return [
        { id: 'box-1', color: boxColor as DropBoxColor },
        { id: 'box-2', color: boxColor as DropBoxColor },
      ];
    }

    return [
      { id: 'box-1', color: 'yellow' as DropBoxColor },
      { id: 'box-2', color: 'purple' as DropBoxColor },
    ];
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

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
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
    const isDroppedOutsideBox = !dropBoxes.some((box) => box.id === over.id);
    if (isDroppedOutsideBox) {
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

    // 检查是否拖到了 dropbox
    const isDroppedInBox = dropBoxes.some((box) => box.id === over.id);
    if (!isDroppedInBox) return;

    // 找到被拖动的项目
    const draggedItemIndex = items.findIndex((item) => item.key === active.id);
    if (draggedItemIndex === -1) return;

    // 检查目标 dropbox 是否已经有项目
    const existingItemIndex = items.findIndex(
      (item) => item.currentDropBoxId === over.id && item.key !== active.id,
    );

    // 更新项目的 dropbox
    const updatedItems = [...items];

    // 如果目标 dropbox 已经有项目，将其移回可用区域
    if (existingItemIndex !== -1) {
      // 如果被拖动的项目已经在一个 dropbox 中，则交换两个项目的位置
      if (items[draggedItemIndex].currentDropBoxId) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          currentDropBoxId: items[draggedItemIndex].currentDropBoxId,
        };
      } else {
        // 否则，将现有项目移回可用区域
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          currentDropBoxId: undefined,
        };
      }
    }

    // 将被拖动的项目放入目标 dropbox
    updatedItems[draggedItemIndex] = {
      ...updatedItems[draggedItemIndex],
      currentDropBoxId: over.id as string,
    };

    setItems(updatedItems);
    setError(null);
  };

  // 处理提交
  const handleSubmit = async () => {
    // 检查是否两个 dropbox 都有项目
    const box1Item = items.find((item) => item.currentDropBoxId === 'box-1');
    const box2Item = items.find((item) => item.currentDropBoxId === 'box-2');

    if (!box1Item || !box2Item) {
      setError('Please place an item in each box');
      return;
    }

    // 构建答案字符串，例如 "A,B" 表示 A 在第一个盒子，B 在第二个盒子
    const submittedAnswer = `${box1Item.key},${box2Item.key}`;
    await onSubmit(data, submittedAnswer);
  };

  // 获取不在任何 dropbox 中的项目
  const availableItems = items.filter((item) => !item.currentDropBoxId);

  // 检查是否已提交
  const isSubmitted = submittedAnswer !== undefined;

  // 检查是否可以提交
  const canSubmit = items.filter((item) => item.currentDropBoxId).length === 2;

  return (
    <div className="space-y-6">
      <HighlightBox
        theme="gray"
        withBackground={false}
        tag="Contradiction"
        questionMarkContent={questionMarkContent}
        className="space-y-6"
      >
        <MarkdownContent content={data.content} />

        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <div className="space-y-6">
            {/* 两个 DropBox 和中间的剑图标 */}
            <div className="flex flex-col md:flex-row items-stretch justify-between w-full gap-4">
              <div className="flex flex-col items-center w-full flex-1">
                <div className="mb-2 font-medium">Fact 1</div>
                <div className="w-full h-full">
                  <DropBox
                    {...dropBoxes[0]}
                    disabled={isSubmitted || readonly}
                    className="h-full"
                  >
                    {items.find((item) => item.currentDropBoxId === dropBoxes[0].id) && (
                      <DraggableMarkdownItem
                        id={items.find((item) => item.currentDropBoxId === dropBoxes[0].id)!.key}
                        content={
                          items.find((item) => item.currentDropBoxId === dropBoxes[0].id)!.content
                        }
                        disabled={isSubmitted || readonly}
                      />
                    )}
                  </DropBox>
                </div>
              </div>

              {/* 中间的剑图标 */}
              <div className="flex flex-col items-center justify-center mx-2 my-2 md:my-auto">
                <Swords
                  className="text-gray-500"
                  size={28}
                />
              </div>

              <div className="flex flex-col items-center w-full flex-1">
                <div className="mb-2 font-medium">Fact 2</div>
                <div className="w-full h-full">
                  <DropBox
                    {...dropBoxes[1]}
                    disabled={isSubmitted || readonly}
                    className="h-full"
                  >
                    {items.find((item) => item.currentDropBoxId === dropBoxes[1].id) && (
                      <DraggableMarkdownItem
                        id={items.find((item) => item.currentDropBoxId === dropBoxes[1].id)!.key}
                        content={
                          items.find((item) => item.currentDropBoxId === dropBoxes[1].id)!.content
                        }
                        disabled={isSubmitted || readonly}
                      />
                    )}
                  </DropBox>
                </div>
              </div>
            </div>

            {/* 可用的拖动项目，每行显示两个 */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {availableItems.map((item) => (
                <DraggableMarkdownItem
                  key={item.key}
                  id={item.key}
                  content={item.content}
                  disabled={isSubmitted || readonly}
                />
              ))}
            </div>

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

export function renderContradictionBlock(
  block: Block,
  status: BlockStatus,
  onContinue: (data: ContradictionBlockData) => Promise<void>,
  onSubmit?: (data: ContradictionBlockData, submittedAnswer: string) => Promise<void>,
  submittedAnswer?: string,
  readonly?: boolean,
) {
  return (
    <ContradictionBlock
      key={block.id}
      data={block as ContradictionBlockData}
      status={status}
      submittedAnswer={submittedAnswer}
      onSubmit={onSubmit!}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
}

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
