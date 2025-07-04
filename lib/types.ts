export type GameStatus = 'draft' | 'lobby' | 'in_progress' | 'finished';

export interface Game {
  id: string;
  title: string;
  host_id: string;
  status: GameStatus;
  code: string;
  current_question_index: number;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  game_id: string;
  name: string;
  created_at: string;
}

export interface Question {
  id: string;
  game_id: string;
  text: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Option {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id: string;
  participant_id: string;
  question_id: string;
  option_id: string;
  response_time_ms: number | null;
  created_at: string;
}

export interface AnswerDistribution {
  option_id: string;
  option_text: string;
  is_correct: boolean;
  count: number;
  percentage: number;
}