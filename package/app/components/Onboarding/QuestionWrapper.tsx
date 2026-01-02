/**
 * Question Wrapper Component
 * 
 * Wrapper that renders the appropriate question component based on question_type
 */

import React from 'react';
import { Question, UserResponse } from '../../types/onboarding';
import QuestionSingleSelect from './QuestionSingleSelect';
import QuestionMultiSelect from './QuestionMultiSelect';
import QuestionText, { QuestionTextRef } from './QuestionText';
import { useOnboarding } from '../../context/onboardingContext';

interface QuestionWrapperProps {
  question: Question;
  response?: UserResponse;
  disabled?: boolean;
  onRefReady?: (ref: QuestionTextRef | null) => void;
}

const QuestionWrapper: React.FC<QuestionWrapperProps> = ({
  question,
  response,
  disabled = false,
  onRefReady,
}) => {
  const { saveResponse, saveMultipleResponses } = useOnboarding();

  const handleRef = (ref: QuestionTextRef | null) => {
    if (onRefReady) {
      onRefReady(ref);
    }
  };

  const handleSingleSelect = async (optionId: string) => {
    await saveResponse(question.id, optionId);
  };

  const handleMultiSelect = async (optionIds: string[]) => {
    await saveMultipleResponses(question.id, optionIds);
  };

  const handleTextSave = async (textValue: string) => {
    await saveResponse(question.id, undefined, textValue);
  };

  switch (question.question_type) {
    case 'single_select':
      return (
        <QuestionSingleSelect
          question={question}
          response={response}
          onSelect={handleSingleSelect}
          disabled={disabled}
        />
      );

    case 'multi_select':
      return (
        <QuestionMultiSelect
          question={question}
          response={response}
          onSelect={handleMultiSelect}
          disabled={disabled}
        />
      );

    case 'text':
      return (
        <QuestionText
          ref={handleRef}
          question={question}
          response={response}
          onSave={handleTextSave}
          disabled={disabled}
        />
      );

    default:
      return null;
  }
};

export default QuestionWrapper;

