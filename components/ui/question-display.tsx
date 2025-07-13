'use client';

import React, { useState } from 'react';
import { Question, Option } from '@/lib/types';
import { theme } from '@/lib/theme';

interface QuestionDisplayProps {
  question: Question;
  options: Option[];
  onAnswer?: (optionId: string) => void;
  showCorrectAnswer?: boolean;
  selectedOptionId?: string;
  disabled?: boolean;
  className?: string;
}

export function QuestionDisplay({
  question,
  options,
  onAnswer,
  showCorrectAnswer = false,
  selectedOptionId,
  disabled = false,
  className = '',
}: QuestionDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedOptionId || null);
  const [answered, setAnswered] = useState<boolean>(!!selectedOptionId);

  const handleOptionClick = (optionId: string) => {
    if (disabled || answered) return;
    
    setSelectedOption(optionId);
    setAnswered(true);
    onAnswer?.(optionId);
  };

  const getOptionBackground = (option: Option, index: number) => {
    const defaultColors = [
      theme.colors.primary.light,    // Orange
      theme.colors.secondary.light,  // Green
      theme.colors.earth.pale,       // Light brown
      theme.colors.warning,          // Amber
    ];

    if (!answered && !showCorrectAnswer) {
      return selectedOption === option.id ? theme.colors.primary.DEFAULT : defaultColors[index % 4];
    }

    if (showCorrectAnswer) {
      if (option.is_correct) {
        return theme.colors.success;
      }
      if (selectedOption === option.id && !option.is_correct) {
        return theme.colors.error;
      }
    }

    return selectedOption === option.id ? theme.colors.primary.DEFAULT : defaultColors[index % 4];
  };

  const getOptionBorder = (option: Option) => {
    if (!answered && !showCorrectAnswer) {
      return selectedOption === option.id ? theme.colors.primary.DEFAULT : theme.colors.text.light;
    }

    if (showCorrectAnswer) {
      if (option.is_correct) {
        return theme.colors.success;
      }
      if (selectedOption === option.id && !option.is_correct) {
        return theme.colors.error;
      }
    }

    return selectedOption === option.id ? theme.colors.primary.DEFAULT : theme.colors.text.light;
  };

  const getOptionTextColor = (option: Option) => {
    if (showCorrectAnswer && (option.is_correct || (selectedOption === option.id && !option.is_correct))) {
      return 'white';
    }
    return theme.colors.text.DEFAULT;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold flex-1">{question.text}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            disabled={disabled || answered}
            className="flex items-center justify-center p-6 rounded-lg border-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            style={{
              backgroundColor: getOptionBackground(option, index),
              borderColor: getOptionBorder(option),
              color: getOptionTextColor(option),
              opacity: disabled && !answered ? 0.7 : 1,
              cursor: disabled || answered ? 'default' : 'pointer',
              minHeight: '120px',
            }}
          >
            <span className="text-lg font-medium text-center">{option.text}</span>
          </button>
        ))}
      </div>

      {showCorrectAnswer && (
        <div className="mt-6 p-4 rounded-lg bg-background-muted">
          <p className="font-medium">
            {selectedOption && options.find(o => o.id === selectedOption)?.is_correct 
              ? '✅ Correct answer!' 
              : '❌ Incorrect answer'}
          </p>
          <p className="mt-2">
            The correct answer was: {options.find(o => o.is_correct)?.text}
          </p>
        </div>
      )}
    </div>
  );
}