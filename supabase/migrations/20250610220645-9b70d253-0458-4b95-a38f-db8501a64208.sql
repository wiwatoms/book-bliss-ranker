
-- Drop all existing RLS policies that might cause recursion
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Anyone can view active titles" ON public.titles;
DROP POLICY IF EXISTS "Admins can manage titles" ON public.titles;
DROP POLICY IF EXISTS "Anyone can view active covers" ON public.covers;
DROP POLICY IF EXISTS "Admins can manage covers" ON public.covers;
DROP POLICY IF EXISTS "Users can view all votes" ON public.votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON public.votes;
DROP POLICY IF EXISTS "Admins can manage votes" ON public.votes;

-- Disable RLS temporarily to avoid recursion issues
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.titles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.covers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_rounds DISABLE ROW LEVEL SECURITY;

-- Create the covers storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'covers',
  'covers',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

-- Create simple storage policies without recursion
CREATE POLICY "Public can view covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Public can upload covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Public can update covers" ON storage.objects
  FOR UPDATE USING (bucket_id = 'covers');

CREATE POLICY "Public can delete covers" ON storage.objects
  FOR DELETE USING (bucket_id = 'covers');
