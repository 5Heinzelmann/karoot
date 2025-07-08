'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Game } from '@/lib/types';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Edit, Users } from 'lucide-react';
import { QuizMasterCarrot } from '@/components/illustrations/carrot-characters/quiz-master-carrot';

export function GamesList() {
  const router = useRouter();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  const fetchGames = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('host_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGames(data || []);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to load games');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-soil/10 text-soil border-soil/20';
      case 'lobby':
        return 'bg-carrot-light/20 text-carrot-dark border-carrot-light/30';
      case 'in_progress':
        return 'bg-leaf/20 text-leaf-dark border-leaf/30';
      case 'finished':
        return 'bg-carrot/20 text-carrot-dark border-carrot/30';
      default:
        return 'bg-soil/10 text-soil border-soil/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'lobby':
        return 'Lobby';
      case 'in_progress':
        return 'In Progress';
      case 'finished':
        return 'Finished';
      default:
        return status;
    }
  };

  const handleGameClick = (gameId: string) => {
    router.push(`/game/${gameId}/host`);
  };

  const handleCreateGame = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <QuizMasterCarrot size={60} className="animate-bounce mb-4" />
        <div className="text-lg font-ui text-soil">Loading your games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-feedback-error mb-6 font-ui text-lg">{error}</div>
        <Button
          onClick={fetchGames}
          className="bg-carrot hover:bg-carrot-dark text-white font-ui font-semibold shadow-carrot"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-carrot">My Garden of Games</h1>
        <Button
          onClick={handleCreateGame}
          className="flex items-center gap-2 bg-leaf hover:bg-leaf-dark text-white font-ui font-semibold shadow-leaf px-6 py-3"
        >
          <Plus size={18} />
          Plant New Game
        </Button>
      </div>

      {games.length === 0 ? (
        <Card className="text-center py-16 border-carrot-pale shadow-carrot-lg">
          <CardContent>
            <div className="text-soil/70 mb-6">
              <QuizMasterCarrot size={80} className="mx-auto mb-6" />
              <h3 className="text-2xl font-heading font-bold mb-3 text-soil">Your garden is empty!</h3>
              <p className="font-ui text-lg">Plant your first quiz game and watch knowledge grow!</p>
            </div>
            <Button
              onClick={handleCreateGame}
              className="mt-6 bg-leaf hover:bg-leaf-dark text-white font-ui font-semibold shadow-leaf px-8 py-4 text-lg"
            >
              <Plus size={20} className="mr-3" />
              Plant Your First Game
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Card key={game.id} className="hover:shadow-carrot-lg transition-all duration-200 cursor-pointer border-carrot-pale hover:border-carrot group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-heading truncate text-soil group-hover:text-carrot transition-colors">{game.title}</CardTitle>
                  <Badge className={`${getStatusColor(game.status)} font-ui font-medium border`}>
                    {getStatusText(game.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-soil/70 font-ui space-y-1">
                    <div>Game Code: <span className="font-mono font-bold text-carrot">{game.code}</span></div>
                    <div>Created: {new Date(game.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleGameClick(game.id)}
                      className={`flex-1 flex items-center gap-2 font-ui font-semibold transition-all duration-200 ${
                        game.status === 'draft'
                          ? 'bg-carrot hover:bg-carrot-dark text-white shadow-carrot'
                          : 'bg-leaf hover:bg-leaf-dark text-white shadow-leaf'
                      }`}
                    >
                      {game.status === 'draft' ? (
                        <>
                          <Edit size={16} />
                          Edit
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Manage
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}