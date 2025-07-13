'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {AnswerDistribution, Game, Option, Participant, Question} from '@/lib/types';
import {HostLobbyView} from '@/components/game-states/host-lobby-view';
import {HostGameplayView} from '@/components/game-states/host-gameplay-view';
import {HostResultsView} from '@/components/game-states/host-results-view';
import {GameEditor} from '@/components/game-states/game-editor';
import {CarrotIcon} from '@/components/ui/carrot-icon';
import {createClient} from '@/lib/supabase/client';
import {useAuth} from '@/lib/auth/auth-context';

// Extend Participant type with scores for our UI
interface ParticipantWithScore extends Participant {
  score: number;
}

export default function HostPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id as string;
  const { user } = useAuth();
  const [game, setGame] = useState<Game>();
  const [participants, setParticipants] = useState<ParticipantWithScore[]>();
  const [questions, setQuestions] = useState<Question[]>();
  const [options, setOptions] = useState<Record<string, Option[]>>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answerDistributions, setAnswerDistributions] = useState<Record<string, AnswerDistribution[]>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch game data
  useEffect(() => {
    const fetchGameData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log("Host page: Fetching game data for game:", gameId);
        const supabase = createClient();
        
        // Get game data
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();
          
        if (gameError) {
          console.error("Host page: Error fetching game:", gameError);
          throw gameError;
        }
        console.log("Host page: Game data fetched:", gameData);
        
        // Check if user is the game host
        if (gameData.host_id !== user.id) {
          setError('You do not have permission to access this game.');
          setIsLoading(false);
          return;
        }
        
        // Override status from URL if provided
        const status = searchParams.get('status') || gameData.status;
        console.log("Game status:", status);
        setGame({ ...gameData, status: status as 'draft' | 'lobby' | 'in_progress' | 'finished' });
        
        // Get participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants')
          .select('*')
          .eq('game_id', gameId);
          
        if (participantsError) throw participantsError;
        console.log("Participants fetched:", participantsData.length);
        
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
        console.log("Questions fetched:", questionsData.length);
        
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
        console.log("Options fetched for all questions");
        
        // Fetch answer distributions if game is finished
        if (status === 'finished') {
          console.log("Fetching answer distributions for finished game");
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
          console.log("Game is in progress");
          // Make sure we set loading to false for in_progress status too
          setIsLoading(false);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to load game data. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchGameData();
    
    // Set up real-time subscription for game status changes
    const supabase = createClient();
    console.log("Host page: Setting up game subscription for game:", gameId);
    
    const gameSubscription = supabase
      .channel('public:games:host')
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`
        },
        (payload) => {
          const updatedGame = payload.new as Game;
          console.log("Host page: Game update received:", updatedGame);
          
          // If game status changed, update our local state
          if (game && updatedGame.status !== game.status) {
            console.log("Host page: Game status changed from", game.status, "to", updatedGame.status);
            setGame(updatedGame);
            
            // If game is now in progress, make sure we're not in loading state
            if (updatedGame.status === 'in_progress') {
              console.log("Host page: Game is now in progress, ensuring loading state is false");
              setIsLoading(false);
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      console.log("Host page: Cleaning up game subscription");
      supabase.removeChannel(gameSubscription);
    };
  }, [gameId, searchParams, user, game?.status]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStartGame = async () => {
    try {
      console.log("Host page: Starting game:", gameId);
      const supabase = createClient();
      
      // Update game status in the database
      console.log("Host page: Updating game status to in_progress with current_question_index=0");
      const { data, error } = await supabase
        .from('games')
        .update({
          status: 'in_progress',
          current_question_index: 0 // Ensure we start at the first question
        })
        .eq('id', gameId)
        .eq('host_id', user?.id)
        .select();
        
      if (error) {
        console.error("Host page: Error updating game status:", error);
        throw error;
      }
      
      console.log("Host page: Game status updated to in_progress:", data);
      console.log("Host page: Redirecting to in-progress view");
      
      // Redirect to the in-progress view
      window.location.href = `/game/${gameId}/host?status=in_progress`;
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start the game. Please try again.');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNextQuestion = async () => {
    try {
      console.log("Host page: Moving to next question");
      const supabase = createClient();
      
      if (questions && currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        console.log("Host page: Current question index:", currentQuestionIndex, "Next index:", nextIndex);
        
        // Update current question index in the database
        console.log("Host page: Updating current_question_index in database to", nextIndex);
        const { data, error } = await supabase
          .from('games')
          .update({ current_question_index: nextIndex })
          .eq('id', gameId)
          .eq('host_id', user?.id)
          .select();
          
        if (error) {
          console.error("Host page: Error updating question index:", error);
          throw error;
        }
        
        console.log("Host page: Question index updated successfully:", data);
        setCurrentQuestionIndex(nextIndex);
      } else {
        // End the game if we've gone through all questions
        console.log("Host page: Reached last question, ending game");
        await handleEndGame();
      }
    } catch (err) {
      console.error('Error moving to next question:', err);
      setError('Failed to move to the next question. Please try again.');
    }
  };

  const handleEndGame = async () => {
    try {
      console.log("Host page: Ending game:", gameId);
      const supabase = createClient();
      
      // Update game status in the database
      console.log("Host page: Updating game status to finished");
      const { data, error } = await supabase
        .from('games')
        .update({ status: 'finished' })
        .eq('id', gameId)
        .eq('host_id', user?.id)
        .select();
        
      if (error) {
        console.error("Host page: Error updating game status to finished:", error);
        throw error;
      }
      
      console.log("Host page: Game status updated to finished:", data);
      console.log("Host page: Redirecting to finished view");
      
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
          <h1 className="text-xl font-bold mb-2">Game Not Available</h1>
          <p className="text-text-muted mb-4">This game could not be loaded.</p>
        </div>
      </div>
    );
  }

  switch (game.status) {
    case 'draft':
      return (
        <GameEditor
          game={game}
          initialQuestions={questions || []}
          initialOptions={options || {}}
        />
      );
    case 'lobby':
      return (
        <HostLobbyView
          game={game}
          initialParticipants={participants || []}
        />
      );
    case 'in_progress':
      console.log("Host page: Rendering in_progress view");
      console.log("Host page: Current question index:", currentQuestionIndex);
      
      if (!questions || questions.length === 0) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">No Questions Available</h1>
              <p className="text-text-muted mb-4">This game has no questions.</p>
            </div>
          </div>
        );
      }
      
      console.log("Host page: Total questions:", questions.length);
      
      const currentQuestion = questions[currentQuestionIndex];
      console.log("Host page: Current question:", currentQuestion);
      
      const currentOptions = options && currentQuestion ? options[currentQuestion.id] : [];
      console.log("Host page: Current options:", currentOptions ? currentOptions.length : 0);
      
      return (
        <HostGameplayView
          game={game}
          initialQuestion={currentQuestion}
          initialOptions={currentOptions || []}
          totalParticipants={participants?.length || 0}
        />
      );
    case 'finished':
      // Create question summaries from our data
      if (!questions || questions.length === 0) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">No Questions Available</h1>
              <p className="text-text-muted mb-4">This game has no questions to show results for.</p>
            </div>
          </div>
        );
      }
      
      const questionSummaries = questions.map((question) => {
        const distribution = answerDistributions && answerDistributions[question.id] ?
          answerDistributions[question.id] : [];
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
          totalParticipants={participants?.length || 0}
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