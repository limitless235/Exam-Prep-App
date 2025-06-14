
-- Create user profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  skill_level TEXT DEFAULT 'Beginner',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_quiz_date DATE,
  total_quizzes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create quiz attempts table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  questions_data JSONB NOT NULL, -- store the full quiz data
  user_answers JSONB NOT NULL, -- store user's answers
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON public.quiz_attempts;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for quiz attempts
CREATE POLICY "Users can view their own quiz attempts" 
  ON public.quiz_attempts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" 
  ON public.quiz_attempts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update streak and skill level
CREATE OR REPLACE FUNCTION public.update_user_progress(
  p_user_id UUID,
  p_score_percentage INTEGER,
  p_subject TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_quiz_date DATE;
  current_streak INTEGER;
  new_skill_level TEXT;
BEGIN
  -- Get current user data
  SELECT profiles.last_quiz_date, profiles.current_streak 
  INTO last_quiz_date, current_streak
  FROM public.profiles 
  WHERE id = p_user_id;
  
  -- Calculate new streak
  IF last_quiz_date = CURRENT_DATE THEN
    -- Same day, no streak change
    current_streak := current_streak;
  ELSIF last_quiz_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    current_streak := current_streak + 1;
  ELSE
    -- Gap in days, reset streak
    current_streak := 1;
  END IF;
  
  -- Determine skill level based on recent performance
  SELECT 
    CASE 
      WHEN AVG(score_percentage) >= 85 AND COUNT(*) >= 5 THEN 'Advanced'
      WHEN AVG(score_percentage) >= 70 AND COUNT(*) >= 3 THEN 'Intermediate'
      ELSE 'Beginner'
    END
  INTO new_skill_level
  FROM public.quiz_attempts 
  WHERE user_id = p_user_id 
    AND completed_at > NOW() - INTERVAL '30 days';
  
  -- Update user profile
  UPDATE public.profiles 
  SET 
    current_streak = current_streak,
    longest_streak = GREATEST(longest_streak, current_streak),
    last_quiz_date = CURRENT_DATE,
    skill_level = COALESCE(new_skill_level, skill_level),
    total_quizzes = total_quizzes + 1,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;
