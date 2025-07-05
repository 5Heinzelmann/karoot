'use client';

import React, { useState, useEffect } from 'react';
import { Question, Option, Game } from '@/lib/types';
import { QuestionDisplay } from '@/components/ui/question-display';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';

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
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Use Supabase realtime subscriptions to listen for game updates and new questions
  useEffect(() => {
    const supabase = createClient();
    
    console.log("Gameplay view: Setting up game subscription for game:", gameId);
    
    // Subscribe to game updates (status changes and current question index changes)
    const gameSubscription = supabase
      .channel('public:games')
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`
        },
        async (payload) => {
          const updatedGame = payload.new as Game;
          console.log("Gameplay view: Game update received:", updatedGame);
          
          // If game status changed to finished, redirect to results page
          if (updatedGame.status === 'finished') {
            console.log("Gameplay view: Game finished, redirecting to results");
            window.location.href = `/game/${gameId}?status=finished`;
            return;
          }
          
          // If current question index changed, fetch the new question and options
          if (currentQuestion && updatedGame.current_question_index !== currentQuestion.order - 1) {
            console.log("Gameplay view: Question index changed, fetching new question");
            console.log("Current question order:", currentQuestion.order);
            console.log("New question index:", updatedGame.current_question_index);
            
            setWaitingForNextQuestion(true);
            
            try {
              console.log("Gameplay view: Fetching question with index:", updatedGame.current_question_index);
              
              // First try to fetch by order (index + 1)
              let questionData;
              
              const { data: questionsData, error: questionsError } = await supabase
                .from('questions')
                .select('*')
                .eq('game_id', gameId)
                .eq('order', updatedGame.current_question_index + 1)
                .single();
              
              // If that fails, try fetching by direct index as a fallback
              if (questionsError || !questionsData) {
                console.log("Gameplay view: Failed to fetch by order, trying direct index");
                const { data: fallbackData, error: fallbackError } = await supabase
                  .from('questions')
                  .select('*')
                  .eq('game_id', gameId)
                  .order('order', { ascending: true })
                  .range(updatedGame.current_question_index, updatedGame.current_question_index)
                  .single();
                  
                if (fallbackError || !fallbackData) {
                  console.error("Gameplay view: Error fetching new question:", questionsError);
                  console.error("Gameplay view: Fallback also failed:", fallbackError);
                  throw fallbackError || questionsError;
                }
                
                questionData = fallbackData;
              } else {
                questionData = questionsData;
              }
              
              console.log("Gameplay view: New question fetched:", questionData);
              
              // Fetch options for the new question
              const { data: optionsData, error: optionsError } = await supabase
                .from('options')
                .select('*')
                .eq('question_id', questionData.id);
              
              if (optionsError) {
                console.error("Gameplay view: Error fetching options:", optionsError);
                throw optionsError;
              }
              
              console.log("Gameplay view: Options fetched:", optionsData.length);
              
              // Update state with new question and options
              setTimeout(() => {
                console.log("Gameplay view: Updating state with new question");
                setCurrentQuestion(questionData);
                setOptions(optionsData);
                setSelectedOptionId(null);
                setShowFeedback(false);
                setWaitingForNextQuestion(false);
                setQuestionStartTime(Date.now()); // Reset the timer for the new question
              }, 1000);
            } catch (err) {
              console.error('Error fetching new question:', JSON.stringify(err));
              console.error('Game ID:', gameId);
              console.error('Current question index:', updatedGame.current_question_index);
              console.error('Attempted to fetch question with order:', updatedGame.current_question_index + 1);
              setWaitingForNextQuestion(false); // Make sure we exit the waiting state on error
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      console.log("Gameplay view: Cleaning up game subscription");
      supabase.removeChannel(gameSubscription);
    };
  }, [gameId, currentQuestion]);

  const handleAnswer = async (optionId: string) => {
    setSelectedOptionId(optionId);
    
    try {
      const supabase = createClient();
      
      // Check if the answer is correct
      const selectedOption = options.find(option => option.id === optionId);
      const isCorrect = selectedOption?.is_correct || false;
      
      // Calculate actual response time in milliseconds
      const responseTimeMs = Date.now() - questionStartTime;
      
      // Submit the answer to Supabase
      const { error: answerError } = await supabase
        .from('answers')
        .insert({
          participant_id: participantId,
          question_id: currentQuestion?.id,
          option_id: optionId,
          response_time_ms: responseTimeMs
        });
      
      if (answerError) {
        console.error('Error submitting answer:', answerError);
        return;
      }
      
      // Show feedback immediately
      setIsAnswerCorrect(isCorrect);
      setShowFeedback(true);
      
      // The next question will be handled by the Supabase realtime subscription
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
          showTimer={false}
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