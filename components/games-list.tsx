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
        return 'bg-gray-100 text-gray-800';
      case 'lobby':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading your games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={fetchGames} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Games</h1>
        <Button onClick={handleCreateGame} className="flex items-center gap-2">
          <Plus size={16} />
          Create New Game
        </Button>
      </div>

      {games.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500 mb-4">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No games yet</h3>
              <p>Create your first game to get started!</p>
            </div>
            <Button onClick={handleCreateGame} className="mt-4">
              <Plus size={16} className="mr-2" />
              Create Your First Game
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Card key={game.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate">{game.title}</CardTitle>
                  <Badge className={getStatusColor(game.status)}>
                    {getStatusText(game.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <div>Game Code: <span className="font-mono font-bold">{game.code}</span></div>
                    <div>Created: {new Date(game.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleGameClick(game.id)}
                      className="flex-1 flex items-center gap-2"
                      variant={game.status === 'draft' ? 'default' : 'outline'}
                    >
                      {game.status === 'draft' ? (
                        <>
                          <Edit size={14} />
                          Edit
                        </>
                      ) : (
                        <>
                          <Play size={14} />
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