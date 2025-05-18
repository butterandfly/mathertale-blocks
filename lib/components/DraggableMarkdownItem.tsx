/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { MarkdownContent } from './MarkdownContent';
import { cn } from './ui/utils';
import { GripVertical } from 'lucide-react';

export interface DraggableMarkdownItemProps {
  id: string;
  content: string;
  containerGroup?: string;
  disabled?: boolean;
  className?: string;
  sortable?: boolean;
  showHandle?: boolean;
  highlight?: 'none' | 'green' | 'blue' | 'red';
}

export function DraggableMarkdownItem({
  id,
  content,
  containerGroup = 'default',
  disabled = false,
  className,
  sortable = false,
  showHandle = false,
  highlight = 'none',
}: DraggableMarkdownItemProps) {
  // 使用 sortable 或 draggable hook 根据 sortable 属性
  if (sortable) {
    // 使用 useSortable hook
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id,
      disabled,
      data: {
        containerGroup,
        type: 'draggable-markdown-item',
      },
    });

    const style = transform
      ? {
          transform: CSS.Transform.toString(transform),
          transition,
          zIndex: isDragging ? 999 : undefined,
        }
      : undefined;

    const highlightStyles = {
      none: '',
      green: 'border-green-400',
      blue: 'border-blue-400',
      red: 'border-red-400',
    };

    return (
      <div
        ref={setNodeRef}
        {...(!showHandle ? { ...attributes, ...listeners } : {})}
        style={style}
        className={cn(
          'relative rounded-lg border p-4',
          highlightStyles[highlight],
          isDragging && 'opacity-70 shadow-lg',
          disabled && 'cursor-not-allowed opacity-70',
          !disabled && 'transition-colors hover:bg-slate-50',
          className,
        )}
      >
        {showHandle && (
          <div
            {...attributes}
            {...listeners}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2',
              !disabled && 'cursor-grab active:cursor-grabbing',
              disabled && 'cursor-default opacity-50',
            )}
          >
            <GripVertical className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <div className={cn(showHandle && 'pl-8')}>
          <MarkdownContent content={content} />
        </div>
      </div>
    );
  } else {
    // 使用 useDraggable hook
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id,
      data: {
        containerGroup,
        type: 'draggable-markdown-item',
      },
      disabled,
    });

    const style = transform
      ? {
          transform: CSS.Transform.toString(transform),
          transition: 'none',
          zIndex: 999,
          width: 'auto',
        }
      : undefined;

    const highlightStyles = {
      none: '',
      green: 'border-green-400',
      blue: 'border-blue-400',
      red: 'border-red-400',
    };

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={cn(
          'relative rounded-lg border p-4',
          highlightStyles[highlight],
          isDragging && 'opacity-70 shadow-lg',
          disabled && 'cursor-not-allowed opacity-70',
          !disabled && 'cursor-grab active:cursor-grabbing hover:border-slate-300',
          className,
        )}
      >
        <MarkdownContent content={content} />
      </div>
    );
  }
}
