-- =============================================================================
-- Istiqamah App - Supabase Database Schema
-- Run this entire script in your Supabase project's SQL Editor (Dashboard > SQL Editor)
-- =============================================================================

-- 1. Create Profiles Table (Stores user profiles and friend codes)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  friend_code TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Friend',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Daily Progress Table (Stores daily completion, streak, and stats)
CREATE TABLE IF NOT EXISTS public.daily_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date_key TEXT NOT NULL,
  percentage INTEGER DEFAULT 0 NOT NULL,
  total_tasks INTEGER DEFAULT 29 NOT NULL,
  completed_tasks INTEGER DEFAULT 0 NOT NULL,
  prayers_completed INTEGER DEFAULT 0 NOT NULL,
  water_glasses INTEGER DEFAULT 0 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_profile_date UNIQUE (profile_id, date_key)
);

-- 3. Create Indexes for High Performance Querying
CREATE INDEX IF NOT EXISTS idx_profiles_friend_code ON public.profiles(friend_code);
CREATE INDEX IF NOT EXISTS idx_daily_progress_profile_date ON public.daily_progress(profile_id, date_key);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

-- 5. Set Permissive Policies for Anonymous / Public App Access
-- Drops any existing policies first to prevent duplication errors if re-run
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public update to profiles" ON public.profiles;

CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow public insert to profiles" 
  ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to profiles" 
  ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read access to daily_progress" ON public.daily_progress;
DROP POLICY IF EXISTS "Allow public insert to daily_progress" ON public.daily_progress;
DROP POLICY IF EXISTS "Allow public update to daily_progress" ON public.daily_progress;

CREATE POLICY "Allow public read access to daily_progress" 
  ON public.daily_progress FOR SELECT USING (true);

CREATE POLICY "Allow public insert to daily_progress" 
  ON public.daily_progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to daily_progress" 
  ON public.daily_progress FOR UPDATE USING (true);

-- 6. Quiz Columns (Supports competitive friend quiz scoreboards)
ALTER TABLE public.daily_progress ADD COLUMN IF NOT EXISTS quiz_score INTEGER DEFAULT 0;
ALTER TABLE public.daily_progress ADD COLUMN IF NOT EXISTS quiz_streak INTEGER DEFAULT 0;
