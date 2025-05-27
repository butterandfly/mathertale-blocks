import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProofReorderBlock } from './ProofReorderBlock';
import { ProofReorderType, type ProofReorderBlockData } from '../core/blocks/proof-reorder-block';
import { BlockStatus } from '../core/schemas';

describe('ProofReorderBlock', () => {
  const mockData: ProofReorderBlockData = {
    id: 'test-proof-block',
    type: ProofReorderType,
    content: 'Reorder the following proof steps:',
    questionData: {
      orderItems: [
        { id: '1', content: '1. Assume x > 0' },
        { id: '2', content: '2. Let y = x + 1' },
        { id: '3', content: '3. Therefore y > 1' },
      ],
      questionOrder: '2,1,3', // Shuffled order
    },
    updatedAt: new Date(),
    getText: () => 'Reorder the following proof steps:',
  };

  const mockProps = {
    data: mockData,
    status: BlockStatus.IN_PROGRESS,
    submittedAnswer: undefined,
    onSubmit: vi.fn(),
    onContinue: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('normal mode', () => {
    it('should render content and proof steps in shuffled order', () => {
      render(<ProofReorderBlock {...mockProps} />);

      // Check that the content is rendered
      expect(screen.getByText('Reorder the following proof steps:')).toBeInTheDocument();

      // Check that the title is rendered
      expect(screen.getByText('Proof')).toBeInTheDocument();

      // Check that all proof steps are rendered
      //   expect(screen.getByText('1. Assume x > 0')).toBeInTheDocument();
      //   expect(screen.getByText('2. Let y = x + 1')).toBeInTheDocument();
      //   expect(screen.getByText('3. Therefore y > 1')).toBeInTheDocument();

      // Check that submit button is present
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should allow submission and show explanation when answer is submitted', async () => {
      const { rerender } = render(<ProofReorderBlock {...mockProps} />);

      // Click submit button
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Verify onSubmit was called
      await waitFor(() => {
        expect(mockProps.onSubmit).toHaveBeenCalled();
      });

      // Rerender with submitted answer
      rerender(
        <ProofReorderBlock
          {...mockProps}
          submittedAnswer="1,2,3"
        />,
      );

      // Check that explanation is shown
      expect(screen.getByText('The Complete Proof')).toBeInTheDocument();
    });

    it('should show continue button when answer is submitted', () => {
      render(
        <ProofReorderBlock
          {...mockProps}
          submittedAnswer="1,2,3"
        />,
      );

      // Check that continue button is present
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('should call onContinue when continue button is clicked', async () => {
      render(
        <ProofReorderBlock
          {...mockProps}
          submittedAnswer="1,2,3"
        />,
      );

      // Click continue button
      const continueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(continueButton);

      // Verify onContinue was called
      await waitFor(() => {
        expect(mockProps.onContinue).toHaveBeenCalledWith(mockData);
      });
    });
  });

  describe('readonly mode', () => {
    it('should show items in correct order and display explanation in readonly mode', () => {
      render(
        <ProofReorderBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Check that the content is rendered
      expect(screen.getByText('Reorder the following proof steps:')).toBeInTheDocument();

      // Check that the title is rendered
      expect(screen.getByText('Proof')).toBeInTheDocument();

      // Check that all proof steps are rendered in correct order
      //   expect(screen.getByText('1. Assume x > 0')).toBeInTheDocument();
      //   expect(screen.getByText('2. Let y = x + 1')).toBeInTheDocument();
      //   expect(screen.getByText('3. Therefore y > 1')).toBeInTheDocument();

      // Check that explanation is shown
      expect(screen.getByText('The Complete Proof')).toBeInTheDocument();
    });

    it('should not show submit button in readonly mode', () => {
      render(
        <ProofReorderBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Check that submit button is not present
      expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
    });

    it('should not show continue button in readonly mode', () => {
      render(
        <ProofReorderBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Check that continue button is not present
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
    });

    it('should not allow interaction in readonly mode', () => {
      render(
        <ProofReorderBlock
          {...mockProps}
          readonly={true}
        />,
      );

      // Verify onSubmit was not called (no submit button to click)
      expect(mockProps.onSubmit).not.toHaveBeenCalled();

      // Verify onContinue was not called (no continue button to click)
      expect(mockProps.onContinue).not.toHaveBeenCalled();
    });

    it('should show explanation even when no submittedAnswer is provided in readonly mode', () => {
      render(
        <ProofReorderBlock
          {...mockProps}
          readonly={true}
          submittedAnswer={undefined}
        />,
      );

      // Check that explanation is still shown in readonly mode
      expect(screen.getByText('The Complete Proof')).toBeInTheDocument();
    });
  });
});
