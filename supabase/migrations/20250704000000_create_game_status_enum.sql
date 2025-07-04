-- Create game status enum type
CREATE TYPE public.game_status AS ENUM ('draft', 'lobby', 'in_progress', 'finished');