
-- Security and Data Integrity Review - Implement proper RLS policies
-- Drop existing policies if they exist to avoid conflicts

-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.covers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_rounds ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view voting rounds" ON public.voting_rounds;
DROP POLICY IF EXISTS "Anyone can view active covers" ON public.covers;
DROP POLICY IF EXISTS "Anyone can view active titles" ON public.titles;

-- Covers table policies
-- Public read access for all users (needed for voting)
CREATE POLICY "Anyone can view active covers" ON public.covers
  FOR SELECT USING (is_active = true);

-- Only admins can insert new covers
CREATE POLICY "Admins can insert covers" ON public.covers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Only admins can update covers
CREATE POLICY "Admins can update covers" ON public.covers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Only admins can delete covers
CREATE POLICY "Admins can delete covers" ON public.covers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Titles table policies
-- Public read access for all users (needed for voting)
CREATE POLICY "Anyone can view active titles" ON public.titles
  FOR SELECT USING (is_active = true);

-- Only admins can insert new titles
CREATE POLICY "Admins can insert titles" ON public.titles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Only admins can update titles
CREATE POLICY "Admins can update titles" ON public.titles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Only admins can delete titles
CREATE POLICY "Admins can delete titles" ON public.titles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Users table policies
-- Users can view their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (id = auth.uid());

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Votes table policies
-- Users can insert their own votes
CREATE POLICY "Users can insert own votes" ON public.votes
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can view their own votes
CREATE POLICY "Users can view own votes" ON public.votes
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all votes
CREATE POLICY "Admins can view all votes" ON public.votes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Admins can delete votes (for data cleanup)
CREATE POLICY "Admins can delete votes" ON public.votes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Survey answers policies
-- Users can insert their own survey answers
CREATE POLICY "Users can insert own survey answers" ON public.survey_answers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can view their own survey answers
CREATE POLICY "Users can view own survey answers" ON public.survey_answers
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all survey answers
CREATE POLICY "Admins can view all survey answers" ON public.survey_answers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Voting rounds policies
-- Anyone can view voting rounds (needed to know current round)
CREATE POLICY "Anyone can view voting rounds" ON public.voting_rounds
  FOR SELECT TO authenticated USING (true);

-- Only admins can insert new voting rounds
CREATE POLICY "Admins can insert voting rounds" ON public.voting_rounds
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Only admins can update voting rounds
CREATE POLICY "Admins can update voting rounds" ON public.voting_rounds
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );
