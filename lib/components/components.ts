export { Button } from './ui/button';

// export all components from the components folder
export * from './DraggableMarkdownItem';
export * from './DropBox';
export * from './HighlightBox';
export * from './QuestionMarkBadge';
export * from './MarkdownContent';

export * from './ParaBlock';
export * from './NotedBlock';
export * from './SingleChoiceBlock';
export * from './ProofReorderBlock';
export * from './ContradictionBlock';

import { type BlockSchema, type BlockStatus } from '../core/schemas';
import React from 'react';

export interface BlockComponent {
  id: string;
  type: string;
  content: string;
}

// 基础BlockProps接口，所有Block组件的Props可以基于此扩展
export interface BaseBlockProps<T extends BlockSchema = BlockSchema> {
  data: T;
  status: BlockStatus;
  onContinue: (data: T) => Promise<void>;
  readonly?: boolean;
}

export interface BaseQuestionBlockProps<T extends BlockSchema = BlockSchema, A = string>
  extends BaseBlockProps<T> {
  submittedAnswer?: A;
  onSubmit: (data: T, submittedAnswer: A) => Promise<void>;
}

// 统一的blockRenderer类型定义
// export type BlockRenderer<T extends BlockSchema = BlockSchema> =
//   (block: T, status: BlockStatus, onContinue: (data: T) => Promise<void>, ...args: any[]) => React.ReactElement;
export type BlockRenderer<T extends BlockSchema = BlockSchema> = ({
  data,
  status,
  onContinue,
  readonly,
}: BaseBlockProps<T>) => React.ReactElement;

export type QuestionBlockRenderer<T extends BlockSchema = BlockSchema> = ({
  data,
  status,
  onContinue,
  submittedAnswer,
  onSubmit,
  readonly,
}: BaseQuestionBlockProps<T>) => React.ReactElement;
