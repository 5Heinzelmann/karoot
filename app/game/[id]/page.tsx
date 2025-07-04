'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Game, Participant, Question, Option, Answer } from '@/lib/types';
import { LobbyView } from '@/components/game-states/lobby-view';
import { GameplayView } from '@/components/game-states/gameplay-view';
import { ResultsView } from '@/components/game-states/results-view';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';

// Extend Participant type with scores for our UI
interface ParticipantWithScore extends Participant {
  score: number;
}

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameId = params.id as string;
  const supabase = createClient();
  
  const [game, setGame] = useState<Game | null>(null);
  const [participants, setParticipants] = useState<ParticipantWithScore[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [participantName, setParticipantName] = useState<string>('');
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
            
            // Start the timer
            console.log("Participant view: Starting timer");
            const timer = setInterval(() => {
              setTimeRemaining((prev) => {
                if (prev <= 1) {
                  clearInterval(timer);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
            
            // Make sure we set loading to false for in_progress status too
            setIsLoading(false);
            return () => clearInterval(timer);
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
            
            // If game status changed to in_progress, fetch the current question
            if (updatedGame.status === 'in_progress') {
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
                  setIsAnswerSubmitted(false);
                  setSelectedOption(null);
                  setTimeRemaining(15);
                  
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
  }, [gameId, supabase]);

  const handleSubmitAnswer = async (optionId: string) => {
    if (isAnswerSubmitted || !currentQuestion || !participantId) return;
    
    try {
      setSelectedOption(optionId);
      setIsAnswerSubmitted(true);
      
      // Check if the answer is correct
      const isCorrect = currentOptions.find(o => o.id === optionId)?.is_correct || false;
      
      // Calculate score based on time remaining
      const score = isCorrect ? timeRemaining * 100 : 0;
      
      // Record the answer in the database
      const { error: answerError } = await supabase
        .from('answers')
        .insert([{
          participant_id: participantId,
          question_id: currentQuestion.id,
          option_id: optionId,
          response_time_ms: (15 - timeRemaining) * 1000, // Convert seconds to milliseconds
          score: score // Store the score with the answer
        }]);
      
      if (answerError) {
        console.error('Error recording answer:', answerError);
      }
      
      // Update participant score in the database
      const { data: currentParticipant, error: participantError } = await supabase
        .from('participants')
        .select('score')
        .eq('id', participantId)
        .single();
        
      if (!participantError && currentParticipant) {
        const currentScore = currentParticipant.score || 0;
        const newScore = currentScore + score;
        
        const { error: updateError } = await supabase
          .from('participants')
          .update({ score: newScore })
          .eq('id', participantId);
          
        if (updateError) {
          console.error('Error updating participant score:', updateError);
        }
      }
      
      // Update participant score locally
      setParticipants(participants.map(p =>
        p.id === participantId ? { ...p, score: (p.score || 0) + score } : p
      ));
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
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Game Not Found</h1>
          <p className="text-text-muted mb-4">The game you're looking for doesn't exist.</p>
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
      // Fetch participant's answers and calculate score
      const [correctAnswers, setCorrectAnswers] = useState(0);
      const [totalQuestions, setTotalQuestions] = useState(0);
      const [isLoadingResults, setIsLoadingResults] = useState(true);
      
      useEffect(() => {
        async function fetchResults() {
          if (!participantId || !game) return;
          
          try {
            // Get all questions for this game
            const { data: questionsData, error: questionsError } = await supabase
              .from('questions')
              .select('id')
              .eq('game_id', game.id);
              
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
      }, [game.id, participantId, supabase]);
      
      if (isLoadingResults) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <CarrotIcon size={60} color={theme.colors.primary.DEFAULT} className="mx-auto animate-bounce" />
              <p className="mt-4 text-text-muted">Loading your results...</p>
            </div>
          </div>
        );
      }
      
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