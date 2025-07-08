import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JoinGameForm } from '@/components/join-game-form';
import { CreateGameForm } from '@/components/create-game-form';
import { QuizMasterCarrot } from '@/components/illustrations/carrot-characters/quiz-master-carrot';
import { StudentCarrot } from '@/components/illustrations/carrot-characters/student-carrot';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-89px)] flex flex-col items-center justify-center bg-pattern-leaves p-4">
      <div className="w-full max-w-md mx-auto animate-fade">
        <div className="text-center mb-8">
          <div className="flex justify-center items-end gap-4 mb-4">
            <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>
              <StudentCarrot size={50} />
            </div>
            <div className="animate-bounce" style={{ animationDelay: '0.3s' }}>
              <QuizMasterCarrot size={70} />
            </div>
            <div className="animate-bounce" style={{ animationDelay: '0.5s' }}>
              <StudentCarrot size={50} />
            </div>
          </div>
          <h1 className="text-5xl font-heading font-bold text-carrot mb-2 animate-slide-down">
            Karoot!
          </h1>
          <p className="text-soil font-ui text-lg animate-slide-up">
            The real-time quiz game that grows knowledge!
          </p>
        </div>

        <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-carrot-lg border border-carrot-pale p-6 animate-grow">
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-carrot-pale border border-carrot-light">
              <TabsTrigger
                value="join"
                className="font-ui data-[state=active]:bg-carrot data-[state=active]:text-white data-[state=active]:shadow-carrot"
              >
                Join Game
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="font-ui data-[state=active]:bg-leaf data-[state=active]:text-white data-[state=active]:shadow-leaf"
              >
                Create Game
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="join" className="animate-slide-right">
              <JoinGameForm />
            </TabsContent>
            
            <TabsContent value="create" className="animate-slide-left">
              <CreateGameForm />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="text-center mt-8 text-sm text-soil-light font-ui animate-fade">
          <p>© {new Date().getFullYear()} Karoot! - Growing minds, one quiz at a time 🥕</p>
        </div>
      </div>
    </div>
  );
}
