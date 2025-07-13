'use client';

import React from 'react';
import { Participant } from '@/lib/types';
import { CarrotIcon } from './carrot-icon';

interface ParticipantsListProps {
  participants: Participant[];
  className?: string;
  maxHeight?: string;
}

export function ParticipantsList({ 
  participants, 
  className = '',
  maxHeight = '400px'
}: ParticipantsListProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Participants</h3>
        <div className="bg-primary-light rounded-full px-3 py-1 text-sm font-medium">
          {participants.length} {participants.length === 1 ? 'player' : 'players'}
        </div>
      </div>
      
      {participants.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-background-muted">
          <CarrotIcon size={32} />
          <p className="mt-2 text-text-light">Waiting for participants to join...</p>
        </div>
      ) : (
        <div 
          className="overflow-y-auto border rounded-lg bg-white"
          style={{ maxHeight }}
        >
          <ul className="divide-y">
            {participants.map((participant) => (
              <li 
                key={participant.id}
                className="flex items-center px-4 py-3 hover:bg-background-muted transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full mr-3 bg-primary-light">
                  <span className="text-white font-medium">
                    {participant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{participant.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}