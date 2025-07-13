'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Game, Participant, Question, Option } from '@/lib/types';
import { LobbyView } from '@/components/game-states/lobby-view';
import { GameplayView } from '@/components/game-states/gameplay-view';
import { ResultsView } from '@/components/game-states/results-view';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { createClient } from '@/lib/supabase/client';

// Extend Participant type with scores for our UI
interface ParticipantWithScore extends Participant {
  score: number;
}

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const supabase = createClient();
  
  const [game, setGame] = useState<Game | null>(null);
  const [participants, setParticipants] = useState<ParticipantWithScore[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [participantName, setParticipantName] = useState<string>('');
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // These hooks were previously inside the 'finished' case
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoadingResults, setIsLoadingResults] = useState(true);

  // Fetch results when game is finished
  useEffect(() => {
    if (game?.status !== 'finished' || !participantId || !game) return;
    
    async function fetchResults() {
      try {
        setIsLoadingResults(true);
        // Get all questions for this game
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('id')
          .eq('game_id', game!.id);
          
        if (questionsError) throw questionsError;
        
        setTotalQuestions(questionsData.length);
        
        // Get participant's answers
        const { data: answersData, error: answersError } = await supabase
          .from('answers')
          .select('*, options(is_correct)')
          .eq('participant_id', participantId);
          
        if (answersError) throw answersError;
        
        // Count correct answers
        const correct = answersData.filter(answer => answer.options.is_correct).length;
        setCorrectAnswers(correct);
        
        setIsLoadingResults(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setIsLoadingResults(false);
      }
    }
    
    fetchResults();
  }, [game, participantId, supabase]);

  // Initialize participant data from sessionStorage
  useEffect(() => {
    const storedName = sessionStorage.getItem('nickname');
    const storedId = sessionStorage.getItem('participantId');
    
    if (storedName) {
      setParticipantName(storedName);
    }
    
    if (storedId) {
      setParticipantId(storedId);
    }
  }, []);

  // Fetch game data
  useEffect(() => {
    async function fetchGameData() {
      try {
        console.log("Participant view: Fetching game data for game:", gameId);
        // Fetch game details
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();
        
        if (gameError || !gameData) {
          console.error("Game not found:", gameError);
          setError('Game not found. Please check the code and try again.');
          setIsLoading(false);
          return;
        }
        
        console.log("Participant view: Game data fetched:", gameData);
        setGame(gameData);
        
        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants')
          .select('*')
          .eq('game_id', gameId);
        
        if (!participantsError && participantsData) {
          console.log("Participant view: Participants fetched:", participantsData.length);
          // Convert to ParticipantWithScore
          const participantsWithScore = participantsData.map(p => ({
            ...p,
            score: 0 // Initialize scores to 0
          }));
          
          setParticipants(participantsWithScore);
        }
        
        // If game is in progress, fetch current question and options
        if (gameData.status === 'in_progress') {
          console.log("Participant view: Game is in progress, fetching questions");
          const { data: questionsData, error: questionsError } = await supabase
            .from('questions')
            .select('*')
            .eq('game_id', gameId)
            .order('order', { ascending: true });
          
          if (!questionsError && questionsData && questionsData.length > 0) {
            console.log("Participant view: Questions fetched:", questionsData.length);
            const currentQuestionIndex = gameData.current_question_index;
            console.log("Participant view: Current question index:", currentQuestionIndex);
            
            if (currentQuestionIndex >= questionsData.length) {
              console.error("Participant view: Current question index out of bounds");
              setError('Game configuration error. Please contact the host.');
              setIsLoading(false);
              return;
            }
            
            const currentQuestion = questionsData[currentQuestionIndex];
            console.log("Participant view: Current question:", currentQuestion);
            setCurrentQuestion(currentQuestion);
            
            // Fetch options for the current question
            const { data: optionsData, error: optionsError } = await supabase
              .from('options')
              .select('*')
              .eq('question_id', currentQuestion.id);
            
            if (!optionsError && optionsData) {
              console.log("Participant view: Options fetched:", optionsData.length);
              setCurrentOptions(optionsData);
            } else {
              console.error("Participant view: Error fetching options:", optionsError);
            }
            
            // Make sure we set loading to false for in_progress status too
            setIsLoading(false);
            return () => {};
          } else {
            console.error("Participant view: Error fetching questions:", questionsError);
            setError('Failed to load questions. Please try again.');
            setIsLoading(false);
            return;
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to load game data. Please try again.');
        setIsLoading(false);
      }
    }
    
    fetchGameData();
    
    // Set up real-time subscription for participants
    const participantsSubscription = supabase
      .channel('public:participants')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          const newParticipant = payload.new as Participant;
          setParticipants(current => [
            ...current,
            { ...newParticipant, score: 0 }
          ]);
        }
      )
      .subscribe();
    
    // Set up real-time subscription for game status changes
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
          setGame(updatedGame);
          
          // If game status changed or current question changed
          if (updatedGame.status !== game?.status ||
              updatedGame.current_question_index !== game?.current_question_index) {
            
            // If game status changed to finished, reset results loading state
            if (updatedGame.status === 'finished') {
              setIsLoadingResults(true);
              setCorrectAnswers(0);
              setTotalQuestions(0);
            }
            // If game status changed to in_progress, fetch the current question
            else if (updatedGame.status === 'in_progress') {
              try {
                // Fetch current question
                const { data: questionsData, error: questionsError } = await supabase
                  .from('questions')
                  .select('*')
                  .eq('game_id', gameId)
                  .order('order', { ascending: true });
                
                if (!questionsError && questionsData && questionsData.length > 0) {
                  const currentQuestionIndex = updatedGame.current_question_index;
                  const currentQuestion = questionsData[currentQuestionIndex];
                  setCurrentQuestion(currentQuestion);
                  
                  // Fetch options for the current question
                  const { data: optionsData, error: optionsError } = await supabase
                    .from('options')
                    .select('*')
                    .eq('question_id', currentQuestion.id);
                  
                  if (!optionsError && optionsData) {
                    setCurrentOptions(optionsData);
                  }
                }
              } catch (err) {
                console.error('Error fetching question data:', err);
              }
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(participantsSubscription);
      supabase.removeChannel(gameSubscription);
    };
  }, [gameId, supabase, game?.current_question_index, game?.status]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CarrotIcon size={60} className="mx-auto animate-bounce" />
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
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Game Not Found</h1>
          <p className="text-text-muted mb-4">The game you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-white rounded-md inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

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
      // Results are fetched in the top-level useEffect
      
      if (isLoadingResults) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <CarrotIcon size={60} className="mx-auto animate-bounce" />
              <p className="mt-4 text-text-muted">Loading your results...</p>
            </div>
          </div>
        );
      }
      
      return (
        <ResultsView
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
            <Link
              href="/"
              className="px-4 py-2 bg-primary text-white rounded-md inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
  }
}