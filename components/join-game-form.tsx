'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {StudentCarrot} from '@/components/illustrations/carrot-characters/student-carrot';
import {createClient} from '@/lib/supabase/client';

export function JoinGameForm() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!gameCode || gameCode.length !== 4 || !/^\d{4}$/.test(gameCode)) {
      setError('Please enter a valid 4-digit game code');
      return;
    }
    
    if (!nickname || nickname.trim().length < 2) {
      setError('Please enter a nickname (minimum 2 characters)');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Find the game with the provided code
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('id, status')
        .eq('code', gameCode)
        .single();
      
      if (gameError || !gameData) {
        setError('Game not found. Please check the code and try again.');
        setIsLoading(false);
        return;
      }
      
      // Check if the game is in the lobby status
      if (gameData.status !== 'lobby') {
        let statusMessage = 'This game is not currently accepting players.';
        if (gameData.status === 'draft') {
          statusMessage = 'This game is still being set up by the host.';
        } else if (gameData.status === 'in_progress') {
          statusMessage = 'This game is already in progress.';
        } else if (gameData.status === 'finished') {
          statusMessage = 'This game has already finished.';
        }
        
        setError(statusMessage);
        setIsLoading(false);
        return;
      }
      
      // Check if the nickname is already taken in this game
      const { data: existingParticipant } = await supabase
        .from('participants')
        .select('id')
        .eq('game_id', gameData.id)
        .eq('name', nickname)
        .maybeSingle();
      
      if (existingParticipant) {
        setError('This nickname is already taken. Please choose another one.');
        setIsLoading(false);
        return;
      }
      
      // Create a new participant record
      const { data: newParticipant, error: createError } = await supabase
        .from('participants')
        .insert([
          { game_id: gameData.id, name: nickname }
        ])
        .select()
        .single();
      
      if (createError || !newParticipant) {
        console.error('Error creating participant:', createError);
        setError('Failed to join the game. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Store participant info in session storage
      sessionStorage.setItem('nickname', nickname);
      sessionStorage.setItem('gameCode', gameCode);
      sessionStorage.setItem('participantId', newParticipant.id);
      
      // Redirect to game page
      router.push(`/game/${gameData.id}`);
    } catch (err) {
      console.error('Error joining game:', err);
      setError('Failed to join game. Please check the game code and try again.');
      setIsLoading(false);
    }
  };

  const handleGameCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setGameCode(value);
    if (error) setError(null);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (error) setError(null);
  };

  return (
    <Card className="border-carrot-pale shadow-carrot">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <StudentCarrot size={40} />
        </div>
        <CardTitle className="text-2xl font-heading text-carrot">
          Join a Game
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="gameCode" className="text-soil font-ui font-medium">
              Game Code
            </Label>
            <Input
              id="gameCode"
              type="text"
              inputMode="numeric"
              placeholder="Enter 4-digit code"
              value={gameCode}
              onChange={handleGameCodeChange}
              className="text-center text-2xl tracking-widest font-mono border-carrot-light focus:border-carrot focus:ring-carrot/20"
              style={{ letterSpacing: '0.5em' }}
            />
          </div>
          
          <div>
            <Label htmlFor="nickname" className="text-soil font-ui font-medium">
              Your Nickname
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={handleNicknameChange}
              maxLength={15}
              className="text-center font-body border-carrot-light focus:border-carrot focus:ring-carrot/20"
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-feedback-error/10 border border-feedback-error/20 text-feedback-error text-sm font-ui">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full py-3 bg-carrot hover:bg-carrot-dark text-white font-ui font-semibold rounded-lg shadow-carrot transition-all duration-200 hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Joining...
              </span>
            ) : (
              'Join Game'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}