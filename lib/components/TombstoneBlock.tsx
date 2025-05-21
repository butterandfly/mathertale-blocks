import { useState } from 'react';
import { type TombstoneBlockData, Tombstone } from '../core/blocks/tombstone-block';
import { type BaseQuestionBlockProps } from './components';

export interface TombstoneBlockProps extends BaseQuestionBlockProps<TombstoneBlockData> {
  submittedAnswer?: Tombstone;
}

export function TombstoneBlock({
  data,
  submittedAnswer,
  onSubmit,
  onContinue,
}: TombstoneBlockProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (tombstone: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // First submit the answer
      await onSubmit(data, tombstone);
      // Then continue to the next block
      await onContinue(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (submittedAnswer !== undefined) {
    return <div className="text-2xl text-right">{Tombstone[submittedAnswer]}</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text font-medium text-slate-700">Choose the tombstone for this proof:</h3>
      <div className="flex gap-4 justify-center">
        {Object.entries(Tombstone).map(([key, emoji]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={isLoading}
            className="text-xl p-3 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {emoji}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function renderTombstoneBlock({
  data,
  status,
  onContinue,
  submittedAnswer,
  onSubmit,
}: TombstoneBlockProps) {
  return (
    <TombstoneBlock
      key={data.id}
      data={data}
      status={status}
      submittedAnswer={submittedAnswer}
      onSubmit={onSubmit}
      onContinue={onContinue}
    />
  );
}
