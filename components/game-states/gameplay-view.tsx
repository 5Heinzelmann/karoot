'use client';

import React, { useState, useEffect } from 'react';
import { Question, Option, Game } from '@/lib/types';
import { QuestionDisplay } from '@/components/ui/question-display';
import { ThinkingCarrot, StudentCarrot } from '@/components/illustrations';
import { FadeIn, SlideUp, Bounce, Pop, StaggerContainer, StaggerItem } from '@/components/animations';
import { CarrotPattern, CarrotLoader, CarrotProgress } from '@/components/illustrations';
import { Card } from '@/components/ui/card';
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
                // Timer code removed
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
      
      // Submit the answer to Supabase
      const { error: answerError } = await supabase
        .from('answers')
        .insert({
          participant_id: participantId,
          question_id: currentQuestion?.id,
          option_id: optionId,
          response_time_ms: 0 // Response time tracking removed
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
      <div className="w-full max-w-lg mx-auto p-4 text-center relative">
        <CarrotPattern className="absolute inset-0 opacity-5" />
        <FadeIn>
          <div className="relative z-10">
            <Bounce>
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full mb-4 shadow-lg">
                <CarrotLoader size="lg" />
              </div>
            </Bounce>
            <SlideUp delay={0.3}>
              <p className="text-lg text-gray-600 font-medium">Loading your question...</p>
            </SlideUp>
          </div>
        </FadeIn>
      </div>
    );
  }

  if (waitingForNextQuestion) {
    return (
      <div className="w-full max-w-lg mx-auto p-4 text-center relative">
        <CarrotPattern className="absolute inset-0 opacity-5" />
        <FadeIn>
          <div className="relative z-10">
            <Bounce>
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full mb-4 shadow-lg">
                <ThinkingCarrot size={64} thoughtText="..." />
              </div>
            </Bounce>
            
            <SlideUp delay={0.3}>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Ready!</h2>
              <p className="text-gray-600 mb-6">The host is preparing the next question...</p>
            </SlideUp>
            
            <div className="flex justify-center">
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-200">
                <div className="relative">
                  <div className="w-3 h-3 bg-blue-300 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full relative"></div>
                </div>
                <span className="text-gray-600 font-medium">Preparing next question...</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4 relative">
      <CarrotPattern className="absolute inset-0 opacity-5" />
      
      <StaggerContainer>
        <StaggerItem>
          <div className="text-center mb-6 relative z-10">
            <FadeIn>
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 shadow-lg mb-4">
                <ThinkingCarrot size={24} />
                <span className="font-bold text-orange-700">
                  Question {currentQuestion.order}
                </span>
              </div>
            </FadeIn>
          </div>
        </StaggerItem>

        <StaggerItem>
          <Card className="p-6 bg-white border-orange-200 shadow-lg relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <StudentCarrot size={24} />
              <span className="text-sm font-medium text-gray-600">Think carefully!</span>
            </div>
            
            <QuestionDisplay
              question={currentQuestion}
              options={options}
              onAnswer={handleAnswer}
              showCorrectAnswer={showFeedback}
              selectedOptionId={selectedOptionId || undefined}
              disabled={!!selectedOptionId}
            />
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {showFeedback && (
        <Pop delay={0.2}>
          <Card className={`mt-6 p-6 text-white text-center shadow-lg relative z-10 ${
            isAnswerCorrect
              ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-400'
              : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400'
          }`}>
            <div className="flex items-center justify-center space-x-3 mb-2">
              {isAnswerCorrect ? (
                <StudentCarrot size={32} pose="jumping" />
              ) : (
                <StudentCarrot size={32} />
              )}
              <p className="text-2xl font-bold">
                {isAnswerCorrect ? 'Excellent!' : 'Not quite right!'}
              </p>
            </div>
            <p className="text-lg opacity-90">
              {isAnswerCorrect
                ? 'Great job! You got it right!'
                : 'Don\'t worry, keep learning!'
              }
            </p>
          </Card>
        </Pop>
      )}
    </div>
  );
}