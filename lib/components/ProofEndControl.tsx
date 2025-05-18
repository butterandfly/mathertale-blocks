import { useState } from 'react';
import { BlockHeadline } from './BlockHeadline';

// Define the emoji options for proof endings
export type ProofTombstone = '🪦' | '❤️' | '🌼' | '□';

export interface ProofEndControlProps {
  continueValue: string | undefined;
  onSelect: (tombstone: ProofTombstone) => Promise<void>;
}

export function ProofEndControl({ continueValue, onSelect }: ProofEndControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [isShaking, setIsShaking] = useState(false);

  const tombstones: ProofTombstone[] = ['🪦', '❤️', '🌼', '□'];

  const handleSelect = async (tombstone: ProofTombstone) => {
    setIsLoading(true);
    setError(null);

    try {
      await onSelect(tombstone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      // setIsShaking(true);
      // setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  if (continueValue !== undefined) {
    return <BlockHeadline title={continueValue} />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text font-medium text-slate-700">Choose the tombstone for this proof:</h3>
      <div className="flex gap-4 justify-center">
        {tombstones.map((tombstone) => (
          <button
            key={tombstone}
            onClick={() => handleSelect(tombstone)}
            disabled={isLoading}
            className="text-xl p-3 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tombstone}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
