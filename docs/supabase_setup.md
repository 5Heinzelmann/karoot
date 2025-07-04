# Supabase Setup for Karoot

This document provides an overview of the Supabase database setup for the Karoot quiz application.

## Database Schema

We've created migration files for the following tables as specified in the PRD:

1. **Games Table**
   - `id`: UUID primary key
   - `title`: Text for game title
   - `host_id`: UUID for the user hosting the game
   - `status`: Enum for game state (draft, lobby, in_progress, finished)
   - `code`: Text for unique 4-digit numeric game code
   - `current_question_index`: Integer for tracking the current question

2. **Participants Table**
   - `id`: UUID primary key
   - `game_id`: UUID foreign key to games table
   - `name`: Text for unique nickname within the game

3. **Questions Table**
   - `id`: UUID primary key
   - `game_id`: UUID foreign key to games table
   - `text`: Text for question text
   - `order`: Integer for question sequence number

4. **Options Table**
   - `id`: UUID primary key
   - `question_id`: UUID foreign key to questions table
   - `text`: Text for option text
   - `is_correct`: Boolean indicating if this is the correct answer

5. **Answers Table**
   - `id`: UUID primary key
   - `participant_id`: UUID foreign key to participants table
   - `question_id`: UUID foreign key to questions table
   - `option_id`: UUID foreign key to options table
   - `response_time_ms`: Integer for response time in milliseconds (nullable)

## Constraints

We've added the following constraints to ensure data integrity:

1. Unique constraint on game code
2. Unique constraint on participant names within a game
3. Constraint to ensure each question has exactly 4 options
4. Constraint to ensure at least one option is marked as correct for each question

## Files Created

1. Migration files in `supabase/migrations/`:
   - `20250704000000_create_game_status_enum.sql`
   - `20250704000001_create_games_table.sql`
   - `20250704000002_create_participants_table.sql`
   - `20250704000003_create_questions_table.sql`
   - `20250704000004_create_options_table.sql`
   - `20250704000005_create_answers_table.sql`
   - `20250704000006_add_constraints.sql`
   - `README.md`

2. Seed file:
   - `supabase/seed.sql` - Contains sample data for testing

3. Updated configuration:
   - Modified `supabase/config.toml` to include the migration files

## Next Steps

To apply these migrations to your Supabase instance:

1. Make sure you have the Supabase CLI installed
2. For local development, start the local Supabase instance
3. For remote deployment, push the migrations to your remote Supabase instance

## Additional Notes

- The seed file includes a sample quiz with 4 questions and 4 options each
- The migrations include triggers to automatically update the `updated_at` column when records are modified
- All tables use UUID primary keys with the `gen_random_uuid()` function as the default value