import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JoinGameForm } from '@/components/join-game-form';
import { CreateGameForm } from '@/components/create-game-form';
import { CarrotIcon } from '@/components/ui/carrot-icon';
import { theme } from '@/lib/theme';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <CarrotIcon size={60} color={theme.colors.primary.DEFAULT} />
          </div>
          <h1 className="text-4xl font-bold text-primary">Karoot!</h1>
          <p className="text-text-muted mt-2">The real-time quiz game</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="join">Join Game</TabsTrigger>
              <TabsTrigger value="create">Create Game</TabsTrigger>
            </TabsList>
            
            <TabsContent value="join">
              <JoinGameForm />
            </TabsContent>
            
            <TabsContent value="create">
              <CreateGameForm />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="text-center mt-8 text-sm text-text-muted">
          <p>© {new Date().getFullYear()} Karoot! Quiz Game</p>
        </div>
      </div>
    </div>
  );
}
