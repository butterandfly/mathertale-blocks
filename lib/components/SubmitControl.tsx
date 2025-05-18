import { useState } from 'react';
import { Button } from './ui/button';
import { MarkdownContent } from './MarkdownContent';

interface SubmitControlProps {
  // 状态
  isSubmitted: boolean;
  isCorrect?: boolean;
  explanation?: string;

  // 提交相关
  isSubmitEnabled?: boolean;
  onSubmit: () => Promise<void>;
}

export function SubmitControl({
  isSubmitted,
  isCorrect,
  explanation,
  isSubmitEnabled = true,
  onSubmit,
}: SubmitControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // 如果还没提交答案，显示提交按钮
  if (!isSubmitted) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !isSubmitEnabled}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  // 提交后显示结果和解释
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <>
              <span className="text-xl">🎉</span>
              <span className="text-green-600 font-medium text-lg">Correct!</span>
            </>
          ) : (
            <>
              <span className="text-xl">🤔</span>
              <span className="text-amber-600 font-medium text-base">Not quite right.</span>
            </>
          )}
        </div>
        {explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </button>
        )}
      </div>

      {showExplanation && explanation && (
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <h3 className="font-medium text-blue-900">Explanation</h3>
          <MarkdownContent content={explanation} />
        </div>
      )}
    </div>
  );
}
