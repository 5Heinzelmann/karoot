'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Participant, Game } from '@/lib/types';
import { ParticipantsList } from '@/components/ui/participants-list';
import { GameCodeDisplay } from '@/components/ui/game-code-display';
import { Button } from '@/components/ui/button';
import { theme } from '@/lib/theme';

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

  // In a real implementation, this would use Supabase realtime subscriptions
  // to listen for new participants
  useEffect(() => {
    // Simulate new participants joining every few seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && participants.length < 10) {
        const newParticipant: Participant = {
          id: Math.random().toString(36).substring(2, 10),
          game_id: game.id,
          name: `Player${Math.floor(Math.random() * 100)}`,
          created_at: new Date().toISOString(),
        };
        
        setParticipants((prev) => [...prev, newParticipant]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [game.id, participants.length]);

  const handleStartGame = async () => {
    if (participants.length === 0) {
      alert('Wait for at least one participant to join before starting the game.');
      return;
    }

    setIsStarting(true);

    try {
      // In a real implementation, this would call an API to update the game status
      // For now, we'll just simulate a successful update and redirect
      
      // Redirect to the in-progress game page
      router.push(`/game/${game.id}/host?status=in_progress`);
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
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.primary.DEFAULT }}>
          {game.title}
        </h1>
        <p className="text-text-muted mt-2">
          Share the game code with participants to join
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <GameCodeDisplay code={game.code} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Game Controls</h3>
              
              <Button
                onClick={handleStartGame}
                disabled={isStarting || participants.length === 0}
                className="w-full py-3 text-white"
                style={{ backgroundColor: theme.colors.secondary.DEFAULT }}
              >
                {isStarting ? 'Starting...' : 'Start Game'}
              </Button>
              
              <Button
                onClick={handleEditGame}
                variant="outline"
                className="w-full py-3"
                style={{ 
                  borderColor: theme.colors.primary.DEFAULT,
                  color: theme.colors.primary.DEFAULT
                }}
              >
                Edit Questions
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <ParticipantsList 
            participants={participants} 
            maxHeight="400px"
          />
          
          {participants.length === 0 && (
            <div className="mt-4 text-center text-text-muted">
              <p>Waiting for participants to join using the game code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}