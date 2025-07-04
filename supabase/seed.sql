-- Seed data for Karoot application

-- Insert a sample game
INSERT INTO public.games (id, title, host_id, status, code, current_question_index)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Sample Quiz',
  (SELECT id FROM auth.users LIMIT 1), -- This assumes there's at least one user in the auth.users table
  'draft',
  '1234',
  0
);

-- Insert sample questions
INSERT INTO public.questions (id, game_id, text, order)
VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'What is the capital of France?', 1),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Which planet is known as the Red Planet?', 2),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'What is the largest mammal?', 3),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Who wrote "Romeo and Juliet"?', 4);

-- Insert options for question 1
INSERT INTO public.options (question_id, text, is_correct)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'Paris', TRUE),
  ('00000000-0000-0000-0000-000000000002', 'London', FALSE),
  ('00000000-0000-0000-0000-000000000002', 'Berlin', FALSE),
  ('00000000-0000-0000-0000-000000000002', 'Madrid', FALSE);

-- Insert options for question 2
INSERT INTO public.options (question_id, text, is_correct)
VALUES
  ('00000000-0000-0000-0000-000000000003', 'Venus', FALSE),
  ('00000000-0000-0000-0000-000000000003', 'Mars', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Jupiter', FALSE),
  ('00000000-0000-0000-0000-000000000003', 'Saturn', FALSE);

-- Insert options for question 3
INSERT INTO public.options (question_id, text, is_correct)
VALUES
  ('00000000-0000-0000-0000-000000000004', 'Elephant', FALSE),
  ('00000000-0000-0000-0000-000000000004', 'Blue Whale', TRUE),
  ('00000000-0000-0000-0000-000000000004', 'Giraffe', FALSE),
  ('00000000-0000-0000-0000-000000000004', 'Polar Bear', FALSE);

-- Insert options for question 4
INSERT INTO public.options (question_id, text, is_correct)
VALUES
  ('00000000-0000-0000-0000-000000000005', 'Charles Dickens', FALSE),
  ('00000000-0000-0000-0000-000000000005', 'Jane Austen', FALSE),
  ('00000000-0000-0000-0000-000000000005', 'William Shakespeare', TRUE),
  ('00000000-0000-0000-0000-000000000005', 'Mark Twain', FALSE);