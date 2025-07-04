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
    // In a real app, this would be an API call
    // For now, we'll use the mock data
    const status = searchParams.get('status') || game.status;
    setGame({ ...mockGame, status: status as 'draft' | 'lobby' | 'in_progress' | 'finished' });
    setIsLoading(false);
    
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
    } else if (status === 'finished') {
      // Update scores for the mock data
      setParticipants([
        { ...mockParticipants[0], score: 1200 },
        { ...mockParticipants[1], score: 800 },
        { ...mockParticipants[2], score: 500 },
      ]);
    }
  }, [gameId, searchParams, game.status]);

  const handleStartGame = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate starting the game
      window.location.href = `/game/${gameId}/host?status=in_progress`;
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start the game. Please try again.');
    }
  };

  const handleNextQuestion = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate moving to the next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeRemaining(15);
      } else {
        // End the game if we've gone through all questions
        window.location.href = `/game/${gameId}/host?status=finished`;
      }
    } catch (err) {
      console.error('Error moving to next question:', err);
      setError('Failed to move to the next question. Please try again.');
    }
  };

  const handleEndGame = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate ending the game
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