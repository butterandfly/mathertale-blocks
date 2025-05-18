import { QuestionMarkBadge } from './QuestionMarkBadge';

export interface BlockHeadlineProps {
  title: string;
  /**
   * Optional content for the question mark tooltip
   * If provided, a question mark badge will be displayed next to the title
   */
  questionMarkContent?: string;
}

export function BlockHeadline({ title, questionMarkContent }: BlockHeadlineProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="flex items-center gap-1">
        <span className="text-slate-600 font-semibold text-lg">{title}</span>
        {questionMarkContent && (
          <QuestionMarkBadge 
            content={questionMarkContent}
            color="gray"
          />
        )}
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    </div>
  );
} 