'use client';

import React, { useEffect, useState } from 'react';
import { Participant } from '@/lib/types';
import { ParticipantsList } from '@/components/ui/participants-list';
import { CarrotIcon } from '@/components/ui/carrot-icon';
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
  const [isWaiting, setIsWaiting] = useState(true);
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
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-primary-light rounded-full mb-2">
          <CarrotIcon size={32} />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: theme.colors.primary.DEFAULT }}>
          Waiting for the game to start
        </h1>
        <p className="text-text-muted mt-2">
          The host will start the game soon
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-text-muted">You joined as</div>
            <div className="font-bold text-lg">{nickname}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-text-muted">Game Code</div>
            <div className="font-bold text-lg tracking-wider">{gameCode}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <ParticipantsList 
          participants={participants} 
          maxHeight="300px"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <div className="flex items-center space-x-2 text-text-muted">
          <div className="relative">
            <div className="w-3 h-3 bg-primary-light rounded-full animate-ping absolute"></div>
            <div className="w-3 h-3 bg-primary rounded-full relative"></div>
          </div>
          <span>Waiting for host to start the game...</span>
        </div>
      </div>
    </div>
  );
}