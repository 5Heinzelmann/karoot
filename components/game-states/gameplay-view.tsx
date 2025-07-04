'use client';

import React, { useState, useEffect } from 'react';
import { Question, Option } from '@/lib/types';
import { QuestionDisplay } from '@/components/ui/question-display';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';

interface GameplayViewProps {
  gameId: string;
  participantId: string;
  initialQuestion?: Question;
  initialOptions?: Option[];
}

export function GameplayView({
  gameId,
  participantId,
  initialQuestion,
  initialOptions = [],
}: GameplayViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(initialQuestion || null);
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false);

  // In a real implementation, this would use Supabase realtime subscriptions
  // to listen for game updates and new questions

  const handleAnswer = async (optionId: string) => {
    setSelectedOptionId(optionId);
    
    try {
      // In a real implementation, this would call an API to submit the answer
      // For now, we'll just simulate a successful submission
      
      // Check if the answer is correct
      const selectedOption = options.find(option => option.id === optionId);
      const isCorrect = selectedOption?.is_correct || false;
      
      // Show feedback after a short delay
      setTimeout(() => {
        setIsAnswerCorrect(isCorrect);
        setShowFeedback(true);
        
        // After showing feedback, simulate waiting for the next question
        setTimeout(() => {
          setWaitingForNextQuestion(true);
          
          // Simulate receiving a new question after a delay
          setTimeout(() => {
            if (Math.random() > 0.7) {
              // Simulate end of game
              window.location.href = `/game/${gameId}?status=finished`;
            } else {
              // Simulate new question
              const newQuestion: Question = {
                id: Math.random().toString(36).substring(2, 10),
                game_id: gameId,
                text: `What is ${Math.floor(Math.random() * 10)} + ${Math.floor(Math.random() * 10)}?`,
                order: (currentQuestion?.order || 0) + 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              
              const correctAnswer = Math.floor(Math.random() * 4);
              const newOptions: Option[] = Array(4).fill(null).map((_, index) => ({
                id: Math.random().toString(36).substring(2, 10),
                question_id: newQuestion.id,
                text: `Option ${index + 1}`,
                is_correct: index === correctAnswer,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }));
              
              setCurrentQuestion(newQuestion);
              setOptions(newOptions);
              setSelectedOptionId(null);
              setShowFeedback(false);
              setWaitingForNextQuestion(false);
            }
          }, 2000);
        }, 3000);
      }, 1000);
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 text-center">
        <div className="animate-spin mb-4">
          <CarrotIcon size={48} />
        </div>
        <p>Loading question...</p>
      </div>
    );
  }

  if (waitingForNextQuestion) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-primary-light rounded-full mb-4">
          <CarrotIcon size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Waiting for next question</h2>
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2 text-text-muted">
            <div className="relative">
              <div className="w-3 h-3 bg-primary-light rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-primary rounded-full relative"></div>
            </div>
            <span>The host is preparing the next question...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="text-center mb-4">
        <div className="inline-block px-3 py-1 rounded-full bg-primary-light text-sm font-medium mb-2">
          Question {currentQuestion.order}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <QuestionDisplay
          question={currentQuestion}
          options={options}
          onAnswer={handleAnswer}
          showCorrectAnswer={showFeedback}
          selectedOptionId={selectedOptionId || undefined}
          disabled={!!selectedOptionId}
        />
      </div>

      {showFeedback && (
        <div 
          className="mt-6 p-4 rounded-lg text-white text-center"
          style={{ 
            backgroundColor: isAnswerCorrect ? theme.colors.success : theme.colors.error,
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          <p className="text-lg font-bold">
            {isAnswerCorrect ? 'Correct!' : 'Incorrect!'}
          </p>
        </div>
      )}
    </div>
  );
}