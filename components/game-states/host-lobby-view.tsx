'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Participant, Game } from '@/lib/types';
import { ParticipantsList } from '@/components/ui/participants-list';
import { GameCodeDisplay } from '@/components/ui/game-code-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuizMasterCarrot, StudentCarrot } from '@/components/illustrations';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, Bounce, HoverScale } from '@/components/animations';
import { CarrotPattern, CarrotDecorations } from '@/components/illustrations';
import { theme } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';

interface HostLobbyViewProps {
  game: Game;
  initialParticipants?: Participant[];
}

export function HostLobbyView({
  game,
  initialParticipants = [],
}: HostLobbyViewProps) {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [isStarting, setIsStarting] = useState(false);

  // Use Supabase realtime subscriptions to listen for new participants
  useEffect(() => {
    // Set initial participants
    setParticipants(initialParticipants);
    
    const supabase = createClient();
    
    // Subscribe to new participants joining the game
    const participantsSubscription = supabase
      .channel('public:participants')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participants',
          filter: `game_id=eq.${game.id}`
        },
        (payload) => {
          const newParticipant = payload.new as Participant;
          setParticipants(current => {
            // Check if participant already exists to avoid duplicates
            if (current.some(p => p.id === newParticipant.id)) {
              return current;
            }
            return [...current, newParticipant];
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(participantsSubscription);
    };
  }, [game.id, initialParticipants]);

  const handleStartGame = async () => {
    if (participants.length === 0) {
      alert('Wait for at least one participant to join before starting the game.');
      return;
    }

    setIsStarting(true);
    console.log("Host lobby: Starting game:", game.id);

    try {
      const supabase = createClient();
      
      // Update game status in the database
      const { error } = await supabase
        .from('games')
        .update({
          status: 'in_progress',
          current_question_index: 0 // Ensure we start at the first question
        })
        .eq('id', game.id)
        .eq('host_id', game.host_id);
        
      if (error) {
        console.error("Host lobby: Error updating game status:", error);
        throw error;
      }
      
      console.log("Host lobby: Game status updated to in_progress");
      
      // Use window.location.href instead of router.push for a full page reload
      // This ensures all state is reset properly
      window.location.href = `/game/${game.id}/host?status=in_progress`;
    } catch (err) {
      console.error('Error starting game:', err);
      setIsStarting(false);
    }
  };

  const handleEditGame = () => {
    // Redirect to the game editor
    router.push(`/game/${game.id}/host?status=draft`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 relative">
      {/* Carrot background pattern */}
      <CarrotPattern className="absolute inset-0 opacity-5" />
      
      <FadeIn>
        <div className="text-center mb-8 relative z-10">
          <Bounce delay={0.2}>
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full mb-4 shadow-lg">
              <QuizMasterCarrot size={80} withGlasses={true} withHat={true} />
            </div>
          </Bounce>
          
          <SlideUp delay={0.4}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
              {game.title}
            </h1>
            <p className="text-lg text-gray-600">
              Share the game code with participants to join
            </p>
          </SlideUp>
          
          <CarrotDecorations className="absolute -top-4 -right-4 opacity-20" />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <StaggerContainer>
          <StaggerItem>
            <Card className="p-6 mb-6 bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <QuizMasterCarrot size={24} />
                <h3 className="font-semibold text-gray-800">Game Code</h3>
              </div>
              <GameCodeDisplay code={game.code} />
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="p-6 bg-white border-orange-200 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <QuizMasterCarrot size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Game Controls</h3>
                </div>
                
                <HoverScale>
                  <Button
                    onClick={handleStartGame}
                    disabled={isStarting || participants.length === 0}
                    className="w-full py-4 text-white font-semibold text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-200"
                  >
                    {isStarting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Starting Game...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <QuizMasterCarrot size={20} />
                        <span>Start Game</span>
                      </div>
                    )}
                  </Button>
                </HoverScale>
                
                <HoverScale>
                  <Button
                    onClick={handleEditGame}
                    variant="outline"
                    className="w-full py-4 font-semibold text-lg border-2 border-orange-300 text-orange-600 hover:bg-orange-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <QuizMasterCarrot size={20} />
                      <span>Edit Questions</span>
                    </div>
                  </Button>
                </HoverScale>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        <StaggerItem delay={0.2}>
          <Card className="p-6 bg-white border-orange-200 shadow-lg h-fit">
            <div className="flex items-center space-x-3 mb-4">
              <StudentCarrot size={24} />
              <h3 className="font-semibold text-gray-800">
                Participants ({participants.length})
              </h3>
            </div>
            
            <ParticipantsList
              participants={participants}
              maxHeight="400px"
            />
            
            {participants.length === 0 && (
              <div className="mt-4 text-center py-8">
                <div className="mb-4">
                  <StudentCarrot size={48} pose="sleeping" />
                </div>
                <p className="text-gray-500 font-medium">
                  Waiting for participants to join using the game code
                </p>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <div className="relative">
                      <div className="w-2 h-2 bg-orange-300 rounded-full animate-ping absolute"></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full relative"></div>
                    </div>
                    <span className="text-sm">Listening for new participants...</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </StaggerItem>
      </div>
    </div>
  );
}