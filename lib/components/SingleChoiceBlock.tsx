'use client';

import { useMemo, useState } from 'react';
import { MarkdownContent } from './MarkdownContent';
import { type BlockSchema, BlockStatus } from '../core/schemas';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { HighlightBox } from './HighlightBox';
import { BlockProgressControl } from './BlockProgressControl';
import { cn } from './ui/utils';
import { SubmitControl } from './SubmitControl';
import { type SingleChoiceBlockData } from '../core/blocks/single-choice-block';

export interface SingleChoiceBlockProps {
  data: SingleChoiceBlockData;
  submittedAnswer?: string;
  status: BlockStatus;
  onSubmit: (data: SingleChoiceBlockData, submittedAnswer: string) => Promise<void>;
  onContinue: (data: SingleChoiceBlockData) => Promise<void>;
}

export function SingleChoiceBlock({
  data,
  submittedAnswer,
  status,
  onSubmit,
  onContinue,
}: SingleChoiceBlockProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const { answer, explanation } = useMemo(() => {
    if (submittedAnswer === undefined) return { answer: null, explanation: null };
    return { answer: data.questionData.answer, explanation: data.questionData.explanation };
  }, [submittedAnswer, data.questionData]);

  const handleSubmit = async () => {
    if (selectedChoice === null) {
      throw new Error('Please select an option');
    }
    await onSubmit(data, selectedChoice);
  };

  const handleChoiceChange = (value: string) => {
    setSelectedChoice(value);
  };

  return (
    <div className="space-y-6">
      <HighlightBox
        theme="gray"
        withBackground={false}
        tag="Single Choice"
        className="space-y-6"
      >
        <MarkdownContent content={data.content} />

        <RadioGroup
          value={selectedChoice || ''}
          onValueChange={handleChoiceChange}
          className="space-y-2"
          disabled={submittedAnswer !== undefined}
        >
          {data.questionData.choices.map((choice) => (
            <Label
              key={choice.key}
              htmlFor={`choice-${data.id}-${choice.key}`}
              className={cn(
                'block relative p-3 rounded-lg transition-all',
                'bg-gray-50 border-2 border-transparent',
                answer === null &&
                  status !== BlockStatus.COMPLETED && [
                    'cursor-pointer',
                    selectedChoice !== choice.key && 'hover:border-gray-200',
                    selectedChoice === choice.key && 'border-gray-900',
                  ],
                answer !== null && [
                  answer === choice.key && 'bg-green-50 border-green-500',
                  submittedAnswer === choice.key &&
                    answer !== choice.key &&
                    'bg-red-50 border-red-500',
                ],
                (answer !== null || status === BlockStatus.COMPLETED) && 'cursor-default',
              )}
            >
              <RadioGroupItem
                value={choice.key}
                id={`choice-${data.id}-${choice.key}`}
                className="sr-only"
              />
              <div className="flex gap-3">
                {/* <span className="font-medium">{choice.key}.</span> */}
                <MarkdownContent content={choice.content} />
              </div>
            </Label>
          ))}
        </RadioGroup>

        <SubmitControl
          isSubmitted={submittedAnswer !== undefined}
          isCorrect={submittedAnswer === data.questionData.answer}
          explanation={explanation ?? undefined}
          isSubmitEnabled={selectedChoice !== null}
          onSubmit={handleSubmit}
        />
      </HighlightBox>

      {submittedAnswer !== undefined && (
        <BlockProgressControl
          status={status}
          onContinue={() => onContinue(data)}
        />
      )}
    </div>
  );
}

export function renderSingleChoiceBlock(
  block: BlockSchema,
  status: BlockStatus,
  onContinue: (data: SingleChoiceBlockData) => Promise<void>,
  submittedAnswer?: string,
  onSubmit?: (data: SingleChoiceBlockData, submittedAnswer: string) => Promise<void>,
) {
  return (
    <SingleChoiceBlock
      key={block.id}
      data={block as SingleChoiceBlockData}
      status={status}
      submittedAnswer={submittedAnswer}
      onSubmit={onSubmit!}
      onContinue={onContinue}
    />
  );
}
