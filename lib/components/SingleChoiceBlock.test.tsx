import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SingleChoiceBlock } from './SingleChoiceBlock';
import { SingleChoiceType, type SingleChoiceBlockData } from '../core/blocks/single-choice-block';
import { BlockStatus } from '../core/schemas';

describe('SingleChoiceBlock', () => {
  const mockData: SingleChoiceBlockData = {
    id: 'test-block-id',
    type: SingleChoiceType,
    content: 'What is 2+2?',
    questionData: {
      choices: [
        { key: 'A', content: '3' },
        { key: 'B', content: '4' },
        { key: 'C', content: '5' },
      ],
      answer: 'B',
      explanation: 'Basic arithmetic: 2+2=4',
    },
    updatedAt: new Date(),
    getText: () => 'What is 2+2?',
  };

  const mockProps = {
    data: mockData,
    status: BlockStatus.IN_PROGRESS,
    submittedAnswer: undefined,
    onSubmit: vi.fn(),
    onContinue: vi.fn(),
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should disable submit button when no answer is selected', () => {
    render(<SingleChoiceBlock {...mockProps} />);

    // Check that the content is rendered
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();

    // Check that all options are rendered
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    // Check that submit button is disabled
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();

    // Try clicking the submit button
    fireEvent.click(submitButton);

    // Verify onSubmit was not called
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should enable submit button and allow submission when an answer is selected', async () => {
    render(<SingleChoiceBlock {...mockProps} />);

    // Find and click on an option
    const option = screen.getByText('4');
    fireEvent.click(option);

    // Check that submit button is enabled
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeEnabled();

    // Click submit
    fireEvent.click(submitButton);

    // Verify onSubmit was called with the correct data
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(mockData, 'B');
    });
  });

  it('should show explanation when answer is submitted', () => {
    render(
      <SingleChoiceBlock
        {...mockProps}
        submittedAnswer="B"
      />,
    );

    // Find and click on "Show Explanation" button
    const explanationButton = screen.getByText('Show Explanation');
    fireEvent.click(explanationButton);

    // Verify explanation is shown
    expect(screen.getByText('Basic arithmetic: 2+2=4')).toBeInTheDocument();
  });

  it('should mark correct answer in green and incorrect in red', () => {
    // First with wrong answer
    const { rerender } = render(
      <SingleChoiceBlock
        {...mockProps}
        submittedAnswer="A"
      />,
    );

    // Find the option labels
    const wrongAnswer = screen.getByText('3').closest('label');
    const correctAnswer = screen.getByText('4').closest('label');

    // Check classes for wrong submission
    expect(wrongAnswer).toHaveClass('bg-red-50');
    expect(correctAnswer).toHaveClass('bg-green-50');

    // Rerender with correct answer
    rerender(
      <SingleChoiceBlock
        {...mockProps}
        submittedAnswer="B"
      />,
    );

    // Check classes for correct submission
    const correctAnswerAfterRerender = screen.getByText('4').closest('label');
    expect(correctAnswerAfterRerender).toHaveClass('bg-green-50');
  });

  describe('readonly mode', () => {
    it('should highlight correct answer and show explanation in readonly mode', () => {
      render(
        <SingleChoiceBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Check that the content is rendered
      expect(screen.getByText('What is 2+2?')).toBeInTheDocument();

      // Check that all options are rendered
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      // Check that correct answer is highlighted
      const correctAnswer = screen.getByText('4').closest('label');
      expect(correctAnswer).toHaveClass('bg-green-50', 'border-green-500');

      // Check that incorrect answers are not highlighted
      const wrongAnswer1 = screen.getByText('3').closest('label');
      const wrongAnswer2 = screen.getByText('5').closest('label');
      expect(wrongAnswer1).not.toHaveClass('bg-green-50', 'border-green-500');
      expect(wrongAnswer2).not.toHaveClass('bg-green-50', 'border-green-500');

      // Check that explanation is shown
      expect(screen.getByText('Explanation')).toBeInTheDocument();
      expect(screen.getByText('Basic arithmetic: 2+2=4')).toBeInTheDocument();
    });

    it('should disable all radio buttons in readonly mode', () => {
      render(
        <SingleChoiceBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Check that all radio buttons are disabled
      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it('should not show submit button in readonly mode', () => {
      render(
        <SingleChoiceBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Check that submit button is not present
      expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
    });

    it('should not show continue button in readonly mode', () => {
      render(
        <SingleChoiceBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Check that continue button is not present
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
    });

    it('should not allow interaction in readonly mode', () => {
      render(
        <SingleChoiceBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Try to click on an option
      const option = screen.getByText('3');
      fireEvent.click(option);

      // Verify onSubmit was not called
      expect(mockProps.onSubmit).not.toHaveBeenCalled();

      // Verify onContinue was not called
      expect(mockProps.onContinue).not.toHaveBeenCalled();
    });

    it('should show explanation even when no submittedAnswer is provided in readonly mode', () => {
      render(
        <SingleChoiceBlock
          {...mockProps}
          readonly={true}
          submittedAnswer={undefined}
        />,
      );

      // Check that explanation is still shown in readonly mode
      expect(screen.getByText('Explanation')).toBeInTheDocument();
      expect(screen.getByText('Basic arithmetic: 2+2=4')).toBeInTheDocument();
    });
  });
});
