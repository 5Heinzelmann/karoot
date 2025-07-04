'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Game, Question, AnswerDistribution, Option } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';

interface QuestionSummary {
  question: Question;
  distribution: AnswerDistribution[];
  totalAnswers: number;
  correctPercentage: number;
}

interface HostResultsViewProps {
  game: Game;
  questionSummaries?: QuestionSummary[];
  totalParticipants: number;
}

export function HostResultsView({
  game,
  questionSummaries = [],
  totalParticipants,
}: HostResultsViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNewGame = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Step 1: Create a new game with the same title but with status 'draft'
      const { data: newGame, error: gameError } = await supabase
        .from('games')
        .insert({
          title: `${game.title} (Copy)`,
          status: 'draft',
          current_question_index: 0
        })
        .select()
        .single();
      
      if (gameError) throw gameError;
      
      // Step 2: Fetch questions for the current game
      const { data: existingQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('*, options(*)')
        .eq('game_id', game.id)
        .order('order', { ascending: true });
      
      if (questionsError) throw questionsError;
      
      // Step 3: Create new questions for the new game
      for (const question of existingQuestions) {
        // Create the question
        const { data: newQuestion, error: newQuestionError } = await supabase
          .from('questions')
          .insert({
            game_id: newGame.id,
            text: question.text,
            order: question.order
          })
          .select()
          .single();
        
        if (newQuestionError) throw newQuestionError;
        
        // Create the options for this question
        const optionsToInsert = question.options.map((option: Option) => ({
          question_id: newQuestion.id,
          text: option.text,
          is_correct: option.is_correct
        }));
        
        const { error: optionsError } = await supabase
          .from('options')
          .insert(optionsToInsert);
        
        if (optionsError) throw optionsError;
      }
      
      // Redirect to the new game's host page
      router.push(`/game/${newGame.id}/host?status=draft`);
    } catch (err) {
      console.error('Error creating new game:', err);
      setIsLoading(false);
    }
  };

  const handlePlayAgain = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Reset the game status to lobby and reset current question index
      const { error } = await supabase
        .from('games')
        .update({
          status: 'lobby',
          current_question_index: 0
        })
        .eq('id', game.id);
      
      if (error) throw error;
      
      // Redirect to the lobby
      router.push(`/game/${game.id}/host?status=lobby`);
    } catch (err) {
      console.error('Error resetting game:', err);
      setIsLoading(false);
    }
  };

  // Calculate overall stats
  const totalCorrectAnswers = questionSummaries.reduce(
    (sum, summary) => sum + Math.round(summary.correctPercentage * summary.totalAnswers / 100),
    0
  );
  const totalAnswers = questionSummaries.reduce(
    (sum, summary) => sum + summary.totalAnswers,
    0
  );
  const overallPercentage = totalAnswers > 0 
    ? Math.round((totalCorrectAnswers / totalAnswers) * 100)
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary-light rounded-full mb-4">
          <CarrotIcon size={48} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.primary.DEFAULT }}>
          Game Complete!
        </h1>
        <p className="text-xl mt-2">
          {game.title}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Game Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-background-muted rounded-lg">
              <span>Total Participants</span>
              <span className="font-bold">{totalParticipants}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-background-muted rounded-lg">
              <span>Questions</span>
              <span className="font-bold">{questionSummaries.length}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-background-muted rounded-lg">
              <span>Overall Correct Answers</span>
              <span className="font-bold">{overallPercentage}%</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              {overallPercentage}%
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Game Controls</h2>
          
          <div className="space-y-4">
            <Button
              onClick={handlePlayAgain}
              disabled={isLoading}
              className="w-full py-3 text-white"
              style={{ backgroundColor: theme.colors.primary.DEFAULT }}
            >
              Play Again with Same Questions
            </Button>
            
            <Button
              onClick={handleNewGame}
              disabled={isLoading}
              className="w-full py-3 text-white"
              style={{ backgroundColor: theme.colors.secondary.DEFAULT }}
            >
              Create New Game
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Question Breakdown</h2>
        
        {questionSummaries.length === 0 ? (
          <div className="text-center p-6 text-text-muted">
            No questions data available
          </div>
        ) : (
          <div className="space-y-6">
            {questionSummaries.map((summary, index) => (
              <div key={summary.question.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <span className="text-sm bg-primary-light px-2 py-1 rounded-full">
                    {summary.correctPercentage}% correct
                  </span>
                </div>
                
                <p className="mb-3">{summary.question.text}</p>
                
                <div className="space-y-2">
                  {summary.distribution.map((item) => (
                    <div key={item.option_id} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ 
                          backgroundColor: item.is_correct ? theme.colors.success : theme.colors.primary.light 
                        }}
                      />
                      <span className="flex-1">{item.option_text}</span>
                      <span className="text-sm text-text-muted">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}