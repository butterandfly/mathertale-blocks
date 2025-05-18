'use client';

import { cn } from './ui/utils';
import { QuestionMarkBadge } from './QuestionMarkBadge';

interface HighlightBoxProps {
  children: React.ReactNode;
  theme?: 'blue' | 'green' | 'amber' | 'purple' | 'gray';
  withBackground?: boolean;
  tag?: string;
  className?: string;
  /**
   * Optional content for the question mark tooltip
   * If provided, a question mark badge will be displayed next to the tag
   */
  questionMarkContent?: string;
}

const themeStyles = {
  blue: {
    border: 'border-blue-200',
    bg: 'bg-blue-50/50',
    tag: 'bg-blue-500 text-white',
  },
  green: {
    border: 'border-green-200',
    bg: 'bg-green-50/50',
    tag: 'bg-green-500 text-white',
  },
  amber: {
    border: 'border-amber-200',
    bg: 'bg-amber-50/50',
    tag: 'bg-amber-500 text-white',
  },
  purple: {
    border: 'border-purple-200',
    bg: 'bg-purple-50/50',
    tag: 'bg-purple-500 text-white',
  },
  gray: {
    border: 'border-gray-200',
    bg: 'bg-gray-50/50',
    tag: 'bg-gray-500 text-white',
  },
} as const;

export function HighlightBox({
  children,
  theme = 'blue',
  withBackground = true,
  tag,
  className,
  questionMarkContent,
}: HighlightBoxProps) {
  const styles = themeStyles[theme];

  return (
    <div className="relative">
      {/* Tag */}
      {tag && (
        <div className="absolute -top-3 left-4 z-2">
          <div className="flex items-center gap-2">
            <span className={cn('px-3 py-1 text-sm font-medium rounded-md shadow-sm', styles.tag)}>
              {tag}
            </span>
            {questionMarkContent && (
              <QuestionMarkBadge
                content={questionMarkContent}
                color="gray"
              />
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          'p-6 rounded-lg border-2',
          styles.border,
          withBackground && styles.bg,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
