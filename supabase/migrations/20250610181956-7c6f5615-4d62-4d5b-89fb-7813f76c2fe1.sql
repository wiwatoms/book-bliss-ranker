
-- Add voting round tracking table
CREATE TABLE public.voting_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_number INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Insert the first voting round
INSERT INTO public.voting_rounds (round_number, is_active) VALUES (1, true);

-- Add voting round reference to votes table
ALTER TABLE public.votes ADD COLUMN voting_round_id UUID REFERENCES public.voting_rounds(id);

-- Update existing votes to belong to round 1
UPDATE public.votes SET voting_round_id = (SELECT id FROM public.voting_rounds WHERE round_number = 1);

-- Make voting_round_id NOT NULL after updating existing data
ALTER TABLE public.votes ALTER COLUMN voting_round_id SET NOT NULL;

-- Enable RLS on voting_rounds table
ALTER TABLE public.voting_rounds ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read voting rounds (for admin dashboard)
CREATE POLICY "Anyone can view voting rounds" 
  ON public.voting_rounds 
  FOR SELECT 
  TO public;

-- Only allow admin operations (will be handled via service role)
CREATE POLICY "Service role can manage voting rounds" 
  ON public.voting_rounds 
  FOR ALL 
  TO service_role;
