'use client';

import React, { useEffect, useState } from 'react';
import { Participant } from '@/lib/types';
import { ParticipantsList } from '@/components/ui/participants-list';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';

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

  // In a real implementation, this would use Supabase realtime subscriptions
  // to listen for new participants and game status changes
  useEffect(() => {
    // Simulate new participants joining every few seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && participants.length < 10) {
        const newParticipant: Participant = {
          id: Math.random().toString(36).substring(2, 10),
          game_id: gameId,
          name: `Player${Math.floor(Math.random() * 100)}`,
          created_at: new Date().toISOString(),
        };
        
        setParticipants((prev) => [...prev, newParticipant]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [gameId, participants.length]);

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