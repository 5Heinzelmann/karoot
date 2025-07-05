'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Game, Question, Option, AnswerDistribution } from '@/lib/types';
import { QuestionDisplay } from '@/components/ui/question-display';
import { AnswerDistribution as AnswerDistributionComponent } from '@/components/ui/answer-distribution';
import { Button } from '@/components/ui/button';
import { theme } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';

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

  // Initialize answer distribution when a new question is loaded
  useEffect(() => {
    if (!currentQuestion || !options.length) {
      console.log("Host gameplay: No current question or options available");
      return;
    }
    
    console.log("Host gameplay: Initializing for question:", currentQuestion.id);
    
    // Create initial distribution with zero counts for all options
    const initialDistribution = options.map(option => ({
      option_id: option.id,
      option_text: option.text,
      is_correct: option.is_correct,
      count: 0,
      percentage: 0,
    }));
    
    setAnswerDistribution(initialDistribution);
    setAnsweredCount(0);
    
    // Fetch any existing answers for this question (in case of reconnection)
    const fetchExistingAnswers = async () => {
      try {
        console.log("Host gameplay: Fetching existing answers for question:", currentQuestion.id);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('answers')
          .select('option_id')
          .eq('question_id', currentQuestion.id);
          
        if (error) {
          console.error("Host gameplay: Error fetching answers:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log("Host gameplay: Found existing answers:", data.length);
          // Count answers by option
          const answerCounts: Record<string, number> = data.reduce((counts: Record<string, number>, answer) => {
            counts[answer.option_id] = (counts[answer.option_id] || 0) + 1;
            return counts;
          }, {});
          
          // Update distribution with existing answers
          setAnswerDistribution(prev => {
            const newDistribution = prev.map(item => ({
              ...item,
              count: answerCounts[item.option_id] || 0,
            }));
            
            // Recalculate percentages
            const totalAnswers = newDistribution.reduce((sum, item) => sum + item.count, 0);
            return newDistribution.map(item => ({
              ...item,
              percentage: totalAnswers > 0 ? Math.round((item.count / totalAnswers) * 100) : 0,
            }));
          });
          
          setAnsweredCount(data.length);
        } else {
          console.log("Host gameplay: No existing answers found");
        }
      } catch (err) {
        console.error('Error fetching existing answers:', err);
      }
    };
    
    fetchExistingAnswers();
  }, [currentQuestion, options]);

  // Use Supabase realtime subscriptions to listen for answer submissions
  useEffect(() => {
    if (!currentQuestion || showingResults) {
      console.log("Host gameplay: Skipping answer subscription setup - no question or showing results");
      return;
    }

    console.log("Host gameplay: Setting up answer subscription for question:", currentQuestion.id);
    const supabase = createClient();
    
    // Subscribe to new answers for the current question
    const answersSubscription = supabase
      .channel('public:answers')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'answers',
          filter: `question_id=eq.${currentQuestion.id}`
        },
        async (payload) => {
          const newAnswer = payload.new;
          console.log("Host gameplay: New answer received:", newAnswer);
          
          try {
            // Update answer distribution
            setAnswerDistribution(prev => {
              const newDistribution = [...prev];
              const optionIndex = newDistribution.findIndex(item => item.option_id === newAnswer.option_id);
              
              if (optionIndex >= 0) {
                newDistribution[optionIndex] = {
                  ...newDistribution[optionIndex],
                  count: newDistribution[optionIndex].count + 1,
                };
                console.log(`Host gameplay: Updated count for option ${newAnswer.option_id} to ${newDistribution[optionIndex].count}`);
              } else {
                console.warn(`Host gameplay: Option ${newAnswer.option_id} not found in distribution`);
              }
              
              // Recalculate percentages
              const totalAnswers = newDistribution.reduce((sum, item) => sum + item.count, 0);
              return newDistribution.map(item => ({
                ...item,
                percentage: Math.round((item.count / totalAnswers) * 100),
              }));
            });
            
            setAnsweredCount(prev => {
              const newCount = prev + 1;
              console.log(`Host gameplay: Updated answer count to ${newCount}`);
              return newCount;
            });
          } catch (err) {
            console.error('Error processing new answer:', err);
          }
        }
      )
      .subscribe();
    
    return () => {
      console.log("Host gameplay: Cleaning up answer subscription");
      supabase.removeChannel(answersSubscription);
    };
  }, [currentQuestion, showingResults]);


  const handleNextQuestion = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Get the current question index from the game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('current_question_index')
        .eq('id', game.id)
        .single();
        
      if (gameError) throw gameError;
      
      // Calculate the next question index
      const nextQuestionIndex = (gameData.current_question_index || 0) + 1;
      
      // Get all questions for this game to determine if we're at the last one
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('game_id', game.id)
        .order('order', { ascending: true });
        
      if (questionsError) throw questionsError;
      
      const isLast = nextQuestionIndex >= questionsData.length - 1;
      setIsLastQuestion(isLast);
      
      // Update the game's current question index
      const { error: updateError } = await supabase
        .from('games')
        .update({ current_question_index: nextQuestionIndex })
        .eq('id', game.id);
      
      if (updateError) throw updateError;
      
      // Fetch the next question
      console.log("Host gameplay: Fetching next question with index:", nextQuestionIndex);
      
      // Use let instead of const so we can reassign if needed
      let questionData;
      let questionError;
      
      // First attempt - using range query
      const questionResult = await supabase
        .from('questions')
        .select('*')
        .eq('game_id', game.id)
        .order('order', { ascending: true })
        .range(nextQuestionIndex, nextQuestionIndex)
        .single();
      
      questionData = questionResult.data;
      questionError = questionResult.error;
      
      if (questionError || !questionData) {
        console.error("Host gameplay: Error fetching next question:", questionError);
        console.error("Host gameplay: Question data:", questionData);
        
        // Try alternative approach - fetch by order
        console.log("Host gameplay: Trying to fetch by order instead");
        const altQuestionResult = await supabase
          .from('questions')
          .select('*')
          .eq('game_id', game.id)
          .eq('order', nextQuestionIndex + 1)
          .single();
          
        if (altQuestionResult.error || !altQuestionResult.data) {
          console.error("Host gameplay: Alternative approach also failed:", altQuestionResult.error);
          throw questionError || new Error("Failed to fetch next question");
        }
        
        console.log("Host gameplay: Successfully fetched question by order");
        questionData = altQuestionResult.data;
      }
      
      // Fetch options for the next question
      const { data: optionsData, error: optionsError } = await supabase
        .from('options')
        .select('*')
        .eq('question_id', questionData.id);
      
      if (optionsError) throw optionsError;
      
      // Update state with the new question and options
      setCurrentQuestion(questionData);
      setOptions(optionsData || []);
      setAnswerDistribution([]);
      setAnsweredCount(0);
      setShowingResults(false);
      setIsLoading(false);
    } catch (err) {
      console.error('Error moving to next question:', JSON.stringify(err));
      console.error('Game ID:', game.id);
      // We can't reference nextQuestionIndex here as it might not be defined if the error occurred earlier
      console.error('Attempted to move to next question after current index:', game.current_question_index);
      setIsLoading(false);
    }
  };

  const handleEndGame = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Update the game status to finished
      const { error: updateError } = await supabase
        .from('games')
        .update({ status: 'finished' })
        .eq('id', game.id);
      
      if (updateError) throw updateError;
      
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
                  onClick={() => setShowingResults(true)}
                  className="w-full py-3"
                  style={{
                    backgroundColor: theme.colors.earth.DEFAULT,
                    color: 'white'
                  }}
                >
                  Close Question
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