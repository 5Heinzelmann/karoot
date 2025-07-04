'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Game, Participant, Question, Option, AnswerDistribution } from '@/lib/types';
import { HostLobbyView } from '@/components/game-states/host-lobby-view';
import { HostGameplayView } from '@/components/game-states/host-gameplay-view';
import { HostResultsView } from '@/components/game-states/host-results-view';
import { GameEditor } from '@/components/game-states/game-editor';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/auth-context';

// Mock data - in a real app, this would come from the backend
const mockGame: Game = {
  id: '123',
  code: 'ABCD',
  title: 'Quiz Game',
  status: 'draft',
  host_id: 'host-123',
  current_question_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Extend Participant type with scores for our UI
interface ParticipantWithScore extends Participant {
  score: number;
}

const mockParticipants: ParticipantWithScore[] = [
  { id: 'p1', game_id: '123', name: 'Player 1', score: 0, created_at: new Date().toISOString() },
  { id: 'p2', game_id: '123', name: 'Player 2', score: 0, created_at: new Date().toISOString() },
  { id: 'p3', game_id: '123', name: 'Player 3', score: 0, created_at: new Date().toISOString() },
];

const mockQuestions: Question[] = [
  {
    id: 'q1',
    game_id: '123',
    text: 'What color is a carrot?',
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'q2',
    game_id: '123',
    text: 'How many sides does a triangle have?',
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockOptions: Record<string, Option[]> = {
  q1: [
    { id: 'o1', question_id: 'q1', text: 'Orange', is_correct: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'o2', question_id: 'q1', text: 'Blue', is_correct: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'o3', question_id: 'q1', text: 'Green', is_correct: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'o4', question_id: 'q1', text: 'Purple', is_correct: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  q2: [
    { id: 'o5', question_id: 'q2', text: 'Three', is_correct: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'o6', question_id: 'q2', text: 'Four', is_correct: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'o7', question_id: 'q2', text: 'Five', is_correct: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'o8', question_id: 'q2', text: 'Six', is_correct: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
};

const mockAnswerDistributions: Record<string, AnswerDistribution[]> = {
  q1: [
    { option_id: 'o1', option_text: 'Orange', is_correct: true, count: 8, percentage: 80 },
    { option_id: 'o2', option_text: 'Blue', is_correct: false, count: 1, percentage: 10 },
    { option_id: 'o3', option_text: 'Green', is_correct: false, count: 1, percentage: 10 },
    { option_id: 'o4', option_text: 'Purple', is_correct: false, count: 0, percentage: 0 },
  ],
  q2: [
    { option_id: 'o5', option_text: 'Three', is_correct: true, count: 6, percentage: 60 },
    { option_id: 'o6', option_text: 'Four', is_correct: false, count: 3, percentage: 30 },
    { option_id: 'o7', option_text: 'Five', is_correct: false, count: 1, percentage: 10 },
    { option_id: 'o8', option_text: 'Six', is_correct: false, count: 0, percentage: 0 },
  ],
};

export default function HostPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id as string;
  const { user } = useAuth();
  const [game, setGame] = useState<Game>(mockGame);
  const [participants, setParticipants] = useState<ParticipantWithScore[]>(mockParticipants);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [options, setOptions] = useState<Record<string, Option[]>>(mockOptions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answerDistributions, setAnswerDistributions] = useState<Record<string, AnswerDistribution[]>>(mockAnswerDistributions);
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch game data
  useEffect(() => {
    const fetchGameData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const supabase = createClient();
        
        // Get game data
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();
          
        if (gameError) throw gameError;
        
        // Check if user is the game host
        if (gameData.host_id !== user.id) {
          setError('You do not have permission to access this game.');
          setIsLoading(false);
          return;
        }
        
        // Override status from URL if provided
        const status = searchParams.get('status') || gameData.status;
        setGame({ ...gameData, status: status as 'draft' | 'lobby' | 'in_progress' | 'finished' });
        
        // Get participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants')
          .select('*')
          .eq('game_id', gameId);
          
        if (participantsError) throw participantsError;
        
        // Transform participants to include score
        const participantsWithScore = participantsData.map(p => ({
          ...p,
          score: 0 // We'll calculate this later
        }));
        
        setParticipants(participantsWithScore);
        
        // Get questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('game_id', gameId)
          .order('order', { ascending: true });
          
        if (questionsError) throw questionsError;
        
        setQuestions(questionsData);
        
        // Get options for all questions
        const optionsRecord: Record<string, Option[]> = {};
        
        for (const question of questionsData) {
          const { data: optionsData, error: optionsError } = await supabase
            .from('options')
            .select('*')
            .eq('question_id', question.id);
            
          if (optionsError) throw optionsError;
          
          optionsRecord[question.id] = optionsData;
        }
        
        setOptions(optionsRecord);
        
        // Fetch answer distributions if game is finished
        if (status === 'finished') {
          const answerDistributionsRecord: Record<string, AnswerDistribution[]> = {};
          
          for (const question of questionsData) {
            // Get all answers for this question
            const { data: answersData, error: answersError } = await supabase
              .from('answers')
              .select('*, options(*)')
              .eq('question_id', question.id);
              
            if (answersError) throw answersError;
            
            // Get all options for this question
            const questionOptions = optionsRecord[question.id];
            
            // Calculate distribution
            const distribution: AnswerDistribution[] = questionOptions.map(option => {
              const answersForOption = answersData.filter(a => a.option_id === option.id);
              const count = answersForOption.length;
              const percentage = answersData.length > 0
                ? Math.round((count / answersData.length) * 100)
                : 0;
                
              return {
                option_id: option.id,
                option_text: option.text,
                is_correct: option.is_correct,
                count,
                percentage
              };
            });
            
            answerDistributionsRecord[question.id] = distribution;
          }
          
          setAnswerDistributions(answerDistributionsRecord);
        }
        
        if (status === 'in_progress') {
          // Start the timer
          const timer = setInterval(() => {
            setTimeRemaining((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to load game data. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchGameData();
  }, [gameId, searchParams, user]);

  const handleStartGame = async () => {
    try {
      const supabase = createClient();
      
      // Update game status in the database
      const { error } = await supabase
        .from('games')
        .update({ status: 'in_progress' })
        .eq('id', gameId)
        .eq('host_id', user?.id);
        
      if (error) throw error;
      
      // Redirect to the in-progress view
      window.location.href = `/game/${gameId}/host?status=in_progress`;
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start the game. Please try again.');
    }
  };

  const handleNextQuestion = async () => {
    try {
      const supabase = createClient();
      
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        
        // Update current question index in the database
        const { error } = await supabase
          .from('games')
          .update({ current_question_index: nextIndex })
          .eq('id', gameId)
          .eq('host_id', user?.id);
          
        if (error) throw error;
        
        setCurrentQuestionIndex(nextIndex);
        setTimeRemaining(15);
      } else {
        // End the game if we've gone through all questions
        await handleEndGame();
      }
    } catch (err) {
      console.error('Error moving to next question:', err);
      setError('Failed to move to the next question. Please try again.');
    }
  };

  const handleEndGame = async () => {
    try {
      const supabase = createClient();
      
      // Update game status in the database
      const { error } = await supabase
        .from('games')
        .update({ status: 'finished' })
        .eq('id', gameId)
        .eq('host_id', user?.id);
        
      if (error) throw error;
      
      // Redirect to the finished view
      window.location.href = `/game/${gameId}/host?status=finished`;
    } catch (err) {
      console.error('Error ending game:', err);
      setError('Failed to end the game. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CarrotIcon size={60} color={theme.colors.primary.DEFAULT} className="mx-auto animate-bounce" />
          <p className="mt-4 text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-error text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2">Oops! Something went wrong</h1>
          <p className="text-text-muted mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate view based on game status
  switch (game.status) {
    case 'draft':
      return (
        <GameEditor
          game={game}
          initialQuestions={questions}
          initialOptions={options}
        />
      );
    case 'lobby':
      return (
        <HostLobbyView
          game={game}
          initialParticipants={participants}
        />
      );
    case 'in_progress':
      const currentQuestion = questions[currentQuestionIndex];
      const currentOptions = options[currentQuestion.id];
      const currentDistribution = answerDistributions[currentQuestion.id];
      
      return (
        <HostGameplayView
          game={game}
          initialQuestion={currentQuestion}
          initialOptions={currentOptions}
          totalParticipants={participants.length}
        />
      );
    case 'finished':
      // Create question summaries from our data
      const questionSummaries = questions.map((question, index) => {
        const distribution = answerDistributions[question.id] || [];
        const totalAnswers = distribution.reduce((sum, item) => sum + item.count, 0);
        const correctOption = distribution.find(item => item.is_correct);
        const correctPercentage = correctOption && totalAnswers > 0
          ? Math.round((correctOption.count / totalAnswers) * 100)
          : 0;
          
        return {
          question,
          distribution,
          totalAnswers,
          correctPercentage
        };
      });

      return (
        <HostResultsView
          game={game}
          questionSummaries={questionSummaries}
          totalParticipants={participants.length}
        />
      );
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2">Game Not Available</h1>
            <p className="text-text-muted mb-4">This game is not currently active.</p>
            <a 
              href="/"
              className="px-4 py-2 bg-primary text-white rounded-md inline-block"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
  }
}