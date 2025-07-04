-- Add unique constraint to game code
ALTER TABLE public.games
ADD CONSTRAINT games_code_unique UNIQUE (code);

-- Add unique constraint to participant names within a game
ALTER TABLE public.participants
ADD CONSTRAINT participants_game_id_name_unique UNIQUE (game_id, name);