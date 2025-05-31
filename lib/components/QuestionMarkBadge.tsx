import { cn } from './ui/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { MarkdownContent } from './MarkdownContent';

export interface QuestionMarkBadgeProps {
  /**
   * The content to display in the tooltip, markdown is supported
   */
  content: string;
  /**
   * The color of the badge
   * @default 'gray'
   */
  color?: 'gray' | 'green' | 'blue' | 'yellow' | 'red';
  /**
   * Additional class names to apply to the badge
   */
  className?: string;
}

const colorStyles = {
  gray: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  yellow: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  red: 'bg-red-100 text-red-700 hover:bg-red-200',
} as const;

export function QuestionMarkBadge({ content, color = 'gray', className }: QuestionMarkBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center justify-center w-5 h-5 rounded-full cursor-help transition-colors',
              colorStyles[color],
              className,
            )}
          >
            <span className="text-xs font-medium">?</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 text-white border-slate-700">
          <div className="text-white">
            <MarkdownContent
              content={content}
              className="prose-invert prose-sm max-w-none text-white"
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
