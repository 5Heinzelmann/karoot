-- Create options table
CREATE TABLE public.options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_options_updated_at
BEFORE UPDATE ON public.options
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();