
-- Fix Function Search Path for security
-- Update existing functions to use immutable search_path for security

-- Fix update_user_progress function
CREATE OR REPLACE FUNCTION public.update_user_progress(
  p_user_id UUID,
  p_score_percentage INTEGER,
  p_subject TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

-- Fix decrement_seat function (if it exists)
CREATE OR REPLACE FUNCTION public.decrement_seat(p_train_number text, p_seat_column text)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Dynamically build and execute SQL to update the appropriate seat column
  EXECUTE format(
    'UPDATE public.trains 
     SET %I = GREATEST(%I - 1, 0) 
     WHERE train_number = $1',
    p_seat_column, p_seat_column
  ) USING p_train_number;
END;
$$;
