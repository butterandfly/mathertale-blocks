import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import { BlockStatus } from '../core/schemas';
import { cn } from '@/lib/utils';

interface BlockProgressControlProps {
  status: BlockStatus;
  onContinue: () => Promise<void>;
}

/**
 * Block progress control component
 * @param status
 * @param onContinue
 * @returns
 */
export function BlockProgressControl({ status, onContinue }: BlockProgressControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onContinue();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== BlockStatus.IN_PROGRESS) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleContinue}
        disabled={isLoading}
        className={cn('bg-gray-900 text-white hover:bg-gray-800', isShaking && 'animate-shake')}
      >
        {isLoading ? (
          'Loading...'
        ) : (
          <span className="flex items-center gap-1">
            Continue
            <ChevronDown className="w-4 h-4" />
          </span>
        )}
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
