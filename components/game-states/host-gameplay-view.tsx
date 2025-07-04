'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Game, Question, Option, AnswerDistribution } from '@/lib/types';
import { QuestionDisplay } from '@/components/ui/question-display';
import { AnswerDistribution as AnswerDistributionComponent } from '@/components/ui/answer-distribution';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/ui/timer';
import { theme } from '@/lib/theme';

interface HostGameplayViewProps {
  game: Game;
  initialQuestion?: Question;
  initialOptions?: Option[];
  totalParticipants: number;
}

export function HostGameplayView({
  game,
  initialQuestion,
  initialOptions = [],
  totalParticipants,
}: HostGameplayViewProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(initialQuestion || null);
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [answerDistribution, setAnswerDistribution] = useState<AnswerDistribution[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showingResults, setShowingResults] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, this would use Supabase realtime subscriptions
  // to listen for answer submissions

  // Simulate receiving answers
  useEffect(() => {
    if (!currentQuestion || showingResults) return;

    const interval = setInterval(() => {
      if (answeredCount < totalParticipants) {
        // Randomly select an option to simulate an answer
        const randomOptionIndex = Math.floor(Math.random() * options.length);
        const randomOption = options[randomOptionIndex];
        
        // Update answer distribution
        setAnswerDistribution(prev => {
          const newDistribution = [...prev];
          const optionIndex = newDistribution.findIndex(item => item.option_id === randomOption.id);
          
          if (optionIndex >= 0) {
            newDistribution[optionIndex] = {
              ...newDistribution[optionIndex],
              count: newDistribution[optionIndex].count + 1,
            };
          } else {
            newDistribution.push({
              option_id: randomOption.id,
              option_text: randomOption.text,
              is_correct: randomOption.is_correct,
              count: 1,
              percentage: 0,
            });
          }
          
          // Recalculate percentages
          const totalAnswers = newDistribution.reduce((sum, item) => sum + item.count, 0);
          return newDistribution.map(item => ({
            ...item,
            percentage: Math.round((item.count / totalAnswers) * 100),
          }));
        });
        
        setAnsweredCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [currentQuestion, options, answeredCount, totalParticipants, showingResults]);

  const handleTimerComplete = () => {
    setShowingResults(true);
  };

  const handleNextQuestion = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API to move to the next question
      // For now, we'll just simulate a successful update
      
      // Check if this is the last question (for demo purposes, we'll randomly decide)
      const nextIsLast = Math.random() > 0.7;
      
      if (nextIsLast) {
        setIsLastQuestion(true);
      }
      
      // Simulate new question
      const newQuestion: Question = {
        id: Math.random().toString(36).substring(2, 10),
        game_id: game.id,
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
      setAnswerDistribution([]);
      setAnsweredCount(0);
      setShowingResults(false);
      setIsLoading(false);
    } catch (err) {
      console.error('Error moving to next question:', err);
      setIsLoading(false);
    }
  };

  const handleEndGame = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API to end the game
      // For now, we'll just simulate a successful update and redirect
      
      // Redirect to the finished game page
      router.push(`/game/${game.id}/host?status=finished`);
    } catch (err) {
      console.error('Error ending game:', err);
      setIsLoading(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center">
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.colors.primary.DEFAULT }}>
          {game.title}
        </h1>
        <div className="inline-block px-3 py-1 rounded-full bg-primary-light text-sm font-medium mt-2">
          Question {currentQuestion.order}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <QuestionDisplay
            question={currentQuestion}
            options={options}
            showTimer={false}
            showCorrectAnswer={showingResults}
          />
          
          {!showingResults && (
            <div className="mt-6 flex justify-center">
              <Timer 
                duration={15} 
                onComplete={handleTimerComplete}
                size="lg"
              />
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <AnswerDistributionComponent
              distribution={answerDistribution}
              totalParticipants={totalParticipants}
            />
            
            <div className="mt-4 text-center">
              <p className="text-text-muted">
                {answeredCount} of {totalParticipants} participants answered
              </p>
              <div className="w-full bg-background-muted rounded-full h-2.5 mt-2">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${(answeredCount / totalParticipants) * 100}%`,
                    backgroundColor: theme.colors.primary.DEFAULT,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Game Controls</h3>
              
              {showingResults ? (
                isLastQuestion ? (
                  <Button
                    onClick={handleEndGame}
                    disabled={isLoading}
                    className="w-full py-3 text-white"
                    style={{ backgroundColor: theme.colors.primary.dark }}
                  >
                    {isLoading ? 'Ending...' : 'End Game'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={isLoading}
                    className="w-full py-3 text-white"
                    style={{ backgroundColor: theme.colors.secondary.DEFAULT }}
                  >
                    {isLoading ? 'Loading...' : 'Next Question'}
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleTimerComplete}
                  className="w-full py-3"
                  style={{ 
                    backgroundColor: theme.colors.earth.DEFAULT,
                    color: 'white'
                  }}
                >
                  Skip Timer
                </Button>
              )}
              
              <Button
                onClick={handleEndGame}
                variant="outline"
                className="w-full py-3"
                style={{ 
                  borderColor: theme.colors.error,
                  color: theme.colors.error
                }}
              >
                End Game Early
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}