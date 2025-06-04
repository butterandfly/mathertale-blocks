import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export type DropBoxColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface DropBoxProps {
  id: string;
  color: DropBoxColor;
  containerGroup?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function DropBox({
  id,
  color,
  containerGroup = 'default',
  children,
  className,
  disabled = false,
}: DropBoxProps) {
  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data: {
      containerGroup,
    },
    disabled,
  });

  const colorStyles: Record<DropBoxColor, string> = {
    red: 'border-red-300 bg-red-50',
    blue: 'border-blue-300 bg-blue-50',
    green: 'border-green-300 bg-green-50',
    yellow: 'border-yellow-300 bg-yellow-50',
    purple: 'border-purple-300 bg-purple-50',
  };

  const isValidDrop = isOver && active?.data?.current?.containerGroup === containerGroup;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-lg border-2 p-3 min-h-[100px] w-full transition-colors',
        colorStyles[color],
        isValidDrop && !disabled && 'border-dashed border-4',
        isValidDrop && color === 'red' && 'border-red-500 bg-red-100',
        isValidDrop && color === 'blue' && 'border-blue-500 bg-blue-100',
        isValidDrop && color === 'green' && 'border-green-500 bg-green-100',
        isValidDrop && color === 'yellow' && 'border-yellow-500 bg-yellow-100',
        isValidDrop && color === 'purple' && 'border-purple-500 bg-purple-100',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      {children}
    </div>
  );
}
