'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Game, Participant, Question, Option, Answer } from '@/lib/types';
import { LobbyView } from '@/components/game-states/lobby-view';
import { GameplayView } from '@/components/game-states/gameplay-view';
import { ResultsView } from '@/components/game-states/results-view';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';

// Mock data - in a real app, this would come from the backend
const mockGame: Game = {
  id: '123',
  code: 'ABCD',
  title: 'Quiz Game',
  status: 'lobby',
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

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id as string;
  const [game, setGame] = useState<Game>(mockGame);
  const [participants, setParticipants] = useState<ParticipantWithScore[]>(mockParticipants);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [participantName, setParticipantName] = useState<string>('');
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize participant name from localStorage if available
  useEffect(() => {
    const storedName = localStorage.getItem('participantName');
    const storedId = localStorage.getItem('participantId');
    
    if (storedName) {
      setParticipantName(storedName);
    }
    
    if (storedId) {
      setParticipantId(storedId);
    }
    
    setIsLoading(false);
  }, []);

  // Fetch game data
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the mock data
    const status = searchParams.get('status') || game.status;
    setGame({ ...mockGame, status: status as 'draft' | 'lobby' | 'in_progress' | 'finished' });
    
    if (status === 'in_progress') {
      setCurrentQuestion(mockQuestions[0]);
      setCurrentOptions(mockOptions[mockQuestions[0].id]);
      
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

  const handleJoinGame = async (name: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate joining the game
      const newParticipantId = `p${Math.random().toString(36).substring(2, 10)}`;
      const newParticipant: ParticipantWithScore = {
        id: newParticipantId,
        game_id: gameId,
        name,
        score: 0,
        created_at: new Date().toISOString(),
      };
      
      setParticipants([...participants, newParticipant]);
      setParticipantName(name);
      setParticipantId(newParticipantId);
      
      // Store in localStorage for persistence
      localStorage.setItem('participantName', name);
      localStorage.setItem('participantId', newParticipantId);
    } catch (err) {
      console.error('Error joining game:', err);
      setError('Failed to join the game. Please try again.');
    }
  };

  const handleSubmitAnswer = async (optionId: string) => {
    if (isAnswerSubmitted || !currentQuestion) return;
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate submitting an answer
      setSelectedOption(optionId);
      setIsAnswerSubmitted(true);
      
      // Check if the answer is correct
      const isCorrect = currentOptions.find(o => o.id === optionId)?.is_correct || false;
      
      // Calculate score based on time remaining
      const score = isCorrect ? timeRemaining * 100 : 0;
      
      // Update participant score
      if (participantId) {
        setParticipants(participants.map(p => 
          p.id === participantId ? { ...p, score: (p.score || 0) + score } : p
        ));
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit your answer. Please try again.');
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
    case 'lobby':
      return (
        <LobbyView
          gameId={game.id}
          gameCode={game.code}
          nickname={participantName}
          initialParticipants={participants}
        />
      );
    case 'in_progress':
      return (
        <GameplayView
          gameId={game.id}
          participantId={participantId || ''}
          initialQuestion={currentQuestion || undefined}
          initialOptions={currentOptions}
        />
      );
    case 'finished':
      // Calculate correct answers (in a real app, this would come from the backend)
      const correctAnswers = 3;
      const totalQuestions = 5;
      
      return (
        <ResultsView
          gameId={game.id}
          nickname={participantName}
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
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