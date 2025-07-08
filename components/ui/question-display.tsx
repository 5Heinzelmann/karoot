'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Option } from '@/lib/types';
import { theme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { SlideUp, SlideDown, Bounce, Pop } from '@/components/animations';
import { ThinkingCarrot } from '@/components/illustrations';

interface QuestionDisplayProps {
  question: Question;
  options: Option[];
  onAnswer?: (optionId: string) => void;
  showCorrectAnswer?: boolean;
  selectedOptionId?: string;
  disabled?: boolean;
  className?: string;
  animated?: boolean;
}

export function QuestionDisplay({
  question,
  options,
  onAnswer,
  showCorrectAnswer = false,
  selectedOptionId,
  disabled = false,
  className = '',
  animated = true,
}: QuestionDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedOptionId || null);
  const [answered, setAnswered] = useState<boolean>(!!selectedOptionId);

  const handleOptionClick = (optionId: string) => {
    if (disabled || answered) return;
    
    setSelectedOption(optionId);
    setAnswered(true);
    onAnswer?.(optionId);
  };

  const getOptionBackground = (option: Option) => {
    if (!answered && !showCorrectAnswer) {
      return selectedOption === option.id ? theme.colors.carrot.light : theme.colors.background.card;
    }

    if (showCorrectAnswer) {
      if (option.is_correct) {
        return theme.colors.feedback.success;
      }
      if (selectedOption === option.id && !option.is_correct) {
        return theme.colors.feedback.error;
      }
    }

    return selectedOption === option.id ? theme.colors.carrot.light : theme.colors.background.card;
  };

  const getOptionBorder = (option: Option) => {
    if (!answered && !showCorrectAnswer) {
      return selectedOption === option.id ? theme.colors.carrot.orange : theme.colors.carrot.pale;
    }

    if (showCorrectAnswer) {
      if (option.is_correct) {
        return theme.colors.feedback.success;
      }
      if (selectedOption === option.id && !option.is_correct) {
        return theme.colors.feedback.error;
      }
    }

    return selectedOption === option.id ? theme.colors.carrot.orange : theme.colors.carrot.pale;
  };

  const getOptionTextColor = (option: Option) => {
    if (showCorrectAnswer && (option.is_correct || (selectedOption === option.id && !option.is_correct))) {
      return 'white';
    }
    return theme.colors.text.DEFAULT;
  };

  const QuestionWrapper = animated ? SlideDown : 'div';
  const OptionsWrapper = animated ? SlideUp : 'div';

  return (
    <div className={cn("w-full", className)}>
      <QuestionWrapper delay={0.1}>
        <div className="flex items-start gap-4 mb-8">
          <div className="flex-shrink-0">
            <ThinkingCarrot size={48} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-heading font-bold leading-tight" style={{ color: theme.colors.text.DEFAULT }}>
              {question.text}
            </h2>
          </div>
        </div>
      </QuestionWrapper>

      <OptionsWrapper delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => {
            const OptionButton = animated ? motion.button : 'button';
            const motionProps = animated ? {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.5 + index * 0.1, duration: 0.3 },
              whileHover: {
                scale: disabled || answered ? 1 : 1.02,
                y: disabled || answered ? 0 : -2
              },
              whileTap: { scale: disabled || answered ? 1 : 0.98 }
            } : {};

            return (
              <OptionButton
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={disabled || answered}
                className={cn(
                  "flex items-center justify-center p-6 rounded-2xl border-2",
                  "shadow-sm transition-all duration-200 font-body font-medium",
                  "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
                  disabled || answered ? "cursor-default" : "cursor-pointer hover:shadow-xl"
                )}
                style={{
                  backgroundColor: getOptionBackground(option),
                  borderColor: getOptionBorder(option),
                  color: getOptionTextColor(option),
                  opacity: disabled && !answered ? 0.7 : 1,
                  minHeight: '120px',
                  "--tw-ring-color": theme.colors.carrot.orange,
                } as React.CSSProperties}
                {...motionProps}
              >
                <span className="text-lg text-center leading-relaxed">{option.text}</span>
              </OptionButton>
            );
          })}
        </div>
      </OptionsWrapper>

      <AnimatePresence>
        {showCorrectAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8"
          >
            <div
              className="p-6 rounded-2xl border-2 shadow-lg"
              style={{
                backgroundColor: selectedOption && options.find(o => o.id === selectedOption)?.is_correct
                  ? theme.colors.leaf.pale
                  : theme.colors.carrot.pale,
                borderColor: selectedOption && options.find(o => o.id === selectedOption)?.is_correct
                  ? theme.colors.leaf.green
                  : theme.colors.carrot.orange,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {selectedOption && options.find(o => o.id === selectedOption)?.is_correct ? '🥕✅' : '🥕❌'}
                </span>
                <p className="font-heading font-bold text-lg" style={{ color: theme.colors.text.DEFAULT }}>
                  {selectedOption && options.find(o => o.id === selectedOption)?.is_correct
                    ? 'Correct answer!'
                    : 'Incorrect answer'}
                </p>
              </div>
              <p className="font-body" style={{ color: theme.colors.text.muted }}>
                The correct answer was: <span className="font-semibold" style={{ color: theme.colors.text.DEFAULT }}>
                  {options.find(o => o.is_correct)?.text}
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}