-- ============================================
-- SUPABASE BOOKMARKS TABLE SETUP
-- Run this script in your Supabase SQL Editor
-- ============================================

-- Step 1: Create the bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    content_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

-- Step 2: Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_content ON public.bookmarks(content_type, content_id);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;

-- Step 5: Create RLS policies for authenticated users

-- Policy: Users can SELECT their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON public.bookmarks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can INSERT their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
ON public.bookmarks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
ON public.bookmarks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Step 6: Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, DELETE ON public.bookmarks TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.bookmarks_id_seq TO authenticated;

-- ============================================
-- VERIFICATION: Check that table was created
-- ============================================
SELECT 
    table_name,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'bookmarks') as policy_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'bookmarks';
