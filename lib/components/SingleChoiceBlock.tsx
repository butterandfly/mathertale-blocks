import { useMemo, useState } from 'react';
import { MarkdownContent } from './MarkdownContent';
import { BlockStatus } from '../core/schemas';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { HighlightBox } from './HighlightBox';
import { BlockProgressControl } from './BlockProgressControl';
import { cn } from './ui/utils';
import { SubmitControl } from './SubmitControl';
import { type SingleChoiceBlockData } from '../core/blocks/single-choice-block';
import { type BaseQuestionBlockProps } from './components';

export interface SingleChoiceBlockProps extends BaseQuestionBlockProps<SingleChoiceBlockData> {
  submittedAnswer?: string;
  onSubmit: (data: SingleChoiceBlockData, submittedAnswer: string) => Promise<void>;
}

export function SingleChoiceBlock({
  data,
  submittedAnswer,
  status,
  onSubmit,
  onContinue,
  readonly,
}: SingleChoiceBlockProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const { answer, explanation } = useMemo(() => {
    if (readonly) {
      // In readonly mode, always show the correct answer and explanation
      return { answer: data.questionData.answer, explanation: data.questionData.explanation };
    }
    if (submittedAnswer === undefined) return { answer: null, explanation: null };
    return { answer: data.questionData.answer, explanation: data.questionData.explanation };
  }, [readonly, submittedAnswer, data.questionData]);

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
          disabled={submittedAnswer !== undefined || readonly}
        >
          {data.questionData.choices.map((choice) => (
            <Label
              key={choice.key}
              htmlFor={`choice-${data.id}-${choice.key}`}
              className={cn(
                'block relative p-3 rounded-lg transition-all',
                'bg-gray-50 border-2 border-transparent',
                readonly && [
                  // In readonly mode, highlight the correct answer
                  answer === choice.key && 'bg-green-50 border-green-500',
                  'cursor-default',
                ],
                !readonly &&
                  answer === null &&
                  status !== BlockStatus.COMPLETED && [
                    'cursor-pointer',
                    selectedChoice !== choice.key && 'hover:border-gray-200',
                    selectedChoice === choice.key && 'border-gray-900',
                  ],
                !readonly &&
                  answer !== null && [
                    answer === choice.key && 'bg-green-50 border-green-500',
                    submittedAnswer === choice.key &&
                      answer !== choice.key &&
                      'bg-red-50 border-red-500',
                  ],
                !readonly &&
                  (answer !== null || status === BlockStatus.COMPLETED) &&
                  'cursor-default',
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

        {!readonly && (
          <SubmitControl
            isSubmitted={submittedAnswer !== undefined}
            isCorrect={submittedAnswer === data.questionData.answer}
            explanation={explanation ?? undefined}
            isSubmitEnabled={selectedChoice !== null}
            onSubmit={handleSubmit}
          />
        )}

        {readonly && explanation && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <h3 className="font-medium text-blue-900">Explanation</h3>
            <MarkdownContent content={explanation} />
          </div>
        )}
      </HighlightBox>

      {!readonly && submittedAnswer !== undefined && (
        <BlockProgressControl
          status={status}
          onContinue={() => onContinue(data)}
        />
      )}
    </div>
  );
}

export function renderSingleChoiceBlock({
  data,
  status,
  onContinue,
  submittedAnswer,
  onSubmit,
  readonly,
}: SingleChoiceBlockProps) {
  return (
    <SingleChoiceBlock
      key={data.id}
      data={data}
      status={status}
      submittedAnswer={submittedAnswer}
      onSubmit={onSubmit!}
      onContinue={onContinue}
      readonly={readonly}
    />
  );
}
