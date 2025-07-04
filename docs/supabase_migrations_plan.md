# Supabase Migrations Plan for Karoot

This document outlines the database schema and migration plan for the Karoot quiz application.

## Database Schema

Based on the PRD and the type definitions in `lib/types.ts`, we need to create the following tables:

### 1. Games Table

```sql
CREATE TABLE public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status game_status NOT NULL DEFAULT 'draft',
    code TEXT NOT NULL,
    current_question_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2. Participants Table

```sql
CREATE TABLE public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3. Questions Table

```sql
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    order INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4. Options Table

```sql
CREATE TABLE public.options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 5. Answers Table

```sql
CREATE TABLE public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Migration Files

We'll create the following migration files:

1. `20250704000000_create_game_status_enum.sql` - Creates the game_status enum type
2. `20250704000001_create_games_table.sql` - Creates the games table
3. `20250704000002_create_participants_table.sql` - Creates the participants table
4. `20250704000003_create_questions_table.sql` - Creates the questions table
5. `20250704000004_create_options_table.sql` - Creates the options table
6. `20250704000005_create_answers_table.sql` - Creates the answers table

## Future Enhancements

In the future, we may want to add:

1. Row-Level Security (RLS) policies to control access to the data
2. Additional constraints (e.g., unique constraints on game code)
3. Indexes for common query patterns
4. Triggers for updating timestamps
5. Functions for game-related operations