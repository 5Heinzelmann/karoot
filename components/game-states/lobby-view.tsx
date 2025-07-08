'use client';

import React, { useEffect, useState } from 'react';
import { Participant } from '@/lib/types';
import { ParticipantsList } from '@/components/ui/participants-list';
import { StudentCarrot } from '@/components/illustrations';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem, Bounce } from '@/components/animations';
import { CarrotPattern, CarrotLoader } from '@/components/illustrations';
import { Card } from '@/components/ui/card';
import { theme } from '@/lib/theme';
import { createClient } from '@/lib/supabase/client';

interface LobbyViewProps {
  gameId: string;
  gameCode: string;
  nickname: string;
  initialParticipants?: Participant[];
}

export function LobbyView({
  gameId,
  gameCode,
  nickname,
  initialParticipants = [],
}: LobbyViewProps) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const supabase = createClient();

  // Use Supabase realtime subscriptions to listen for new participants
  useEffect(() => {
    // Set initial participants
    setParticipants(initialParticipants);
    
    // Subscribe to new participants joining the game
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
  }, [gameId, initialParticipants, supabase]);
  
  // Listen for game status changes
  useEffect(() => {
    // Subscribe to game status changes
    console.log("Lobby view: Setting up game status subscription for game:", gameId);
    const gameSubscription = supabase
      .channel('public:games')
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`
        },
        (payload) => {
          const updatedGame = payload.new;
          console.log("Lobby view: Game update received:", updatedGame);
          
          // If game status changed to in_progress, refresh the page to load the gameplay view
          if (updatedGame.status === 'in_progress') {
            console.log("Lobby view: Game started, reloading page");
            // Use a more reliable approach than just reload
            window.location.href = `/game/${gameId}?status=in_progress`;
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(gameSubscription);
    };
  }, [gameId, supabase]);

  return (
    <div className="w-full max-w-lg mx-auto p-4 relative">
      {/* Carrot background pattern */}
      <CarrotPattern className="absolute inset-0 opacity-5" />
      
      <FadeIn>
        <div className="text-center mb-8 relative z-10">
          <Bounce delay={0.2}>
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full mb-4 shadow-lg">
              <StudentCarrot size={64} pose="standing" withBackpack={true} />
            </div>
          </Bounce>
          
          <SlideUp delay={0.4}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
              Ready to Learn!
            </h1>
            <p className="text-lg text-gray-600">
              The host will start the game soon
            </p>
          </SlideUp>
        </div>
      </FadeIn>

      <StaggerContainer>
        <StaggerItem>
          <Card className="p-6 mb-6 bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <StudentCarrot size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">You joined as</div>
                  <div className="font-bold text-xl text-gray-800">{nickname}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 font-medium">Game Code</div>
                <div className="font-bold text-2xl tracking-wider text-orange-600 font-mono">
                  {gameCode}
                </div>
              </div>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="p-6 bg-white border-orange-200 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <StudentCarrot size={20} />
              <h3 className="font-semibold text-gray-800">Fellow Students</h3>
            </div>
            <ParticipantsList
              participants={participants}
              maxHeight="300px"
            />
            
            {participants.length === 0 && (
              <div className="text-center py-8">
                <CarrotLoader size="md" />
                <p className="text-gray-500 mt-2">Waiting for other students to join...</p>
              </div>
            )}
          </Card>
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.8}>
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-orange-200">
            <div className="relative">
              <div className="w-3 h-3 bg-orange-300 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full relative"></div>
            </div>
            <span className="text-gray-600 font-medium">Waiting for host to start the game...</span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}