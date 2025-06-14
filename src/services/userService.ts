import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  skill_level: string;
  current_streak: number;
  longest_streak: number;
  last_quiz_date: string | null;
  total_quizzes: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  subject: string;
  difficulty: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken: number | null;
  questions_data: any;
  user_answers: any;
  completed_at: string;
}

export const userService = {
  async getUserProfile(): Promise<UserProfile | null> {
    console.log('🔍 Fetching user profile...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting authenticated user:', userError);
      return null;
    }
    
    if (!user) {
      console.error('❌ No authenticated user found');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('❌ Error fetching user profile:', error);
      
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        console.log('📝 Profile not found, creating new profile...');
        return await this.createUserProfile();
      }
      return null;
    }

    console.log('✅ User profile fetched successfully:', data);
    return data;
  },

  async createUserProfile(): Promise<UserProfile | null> {
    console.log('🔄 Creating user profile...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting authenticated user:', userError);
      return null;
    }
    
    if (!user) {
      console.error('❌ No authenticated user found');
      return null;
    }

    const profileData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Student',
      skill_level: 'Beginner',
      current_streak: 0,
      longest_streak: 0,
      last_quiz_date: null,
      total_quizzes: 0,
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating user profile:', error);
      return null;
    }

    console.log('✅ User profile created successfully:', data);
    return data;
  },

  async updateUserName(newName: string): Promise<boolean> {
    console.log('🔄 Updating user name to:', newName);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting authenticated user:', userError);
      return false;
    }
    
    if (!user) {
      console.error('❌ No authenticated user found');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          name: newName, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating user name:', error);
        return false;
      }

      console.log('✅ User name updated successfully:', data);
      return true;
    } catch (error) {
      console.error('❌ Unexpected error updating user name:', error);
      return false;
    }
  },

  async saveQuizAttempt(
    subject: string,
    difficulty: string,
    totalQuestions: number,
    correctAnswers: number,
    scorePercentage: number,
    timeTaken: number | null,
    questionsData: any,
    userAnswers: any
  ): Promise<boolean> {
    console.log('🔄 Starting saveQuizAttempt...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting authenticated user:', userError);
      return false;
    }
    
    if (!user) {
      console.error('❌ No authenticated user found');
      return false;
    }

    console.log('✅ Authenticated user found:', user.id);

    try {
      console.log('📝 Attempting to insert quiz attempt with data:', {
        user_id: user.id,
        subject,
        difficulty,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score_percentage: scorePercentage,
        time_taken: timeTaken,
        questions_data: questionsData,
        user_answers: userAnswers,
      });

      // Save quiz attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          subject,
          difficulty,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          score_percentage: scorePercentage,
          time_taken: timeTaken,
          questions_data: questionsData,
          user_answers: userAnswers,
        })
        .select();

      if (attemptError) {
        console.error('❌ Error saving quiz attempt:', attemptError);
        console.error('❌ Error details:', {
          message: attemptError.message,
          details: attemptError.details,
          hint: attemptError.hint,
          code: attemptError.code
        });
        return false;
      }

      console.log('✅ Quiz attempt saved successfully:', attemptData);

      // Update user progress
      console.log('📊 Updating user progress...');
      const { data: progressData, error: progressError } = await supabase.rpc('update_user_progress', {
        p_user_id: user.id,
        p_score_percentage: scorePercentage,
        p_subject: subject,
      });

      if (progressError) {
        console.error('❌ Error updating user progress:', progressError);
        console.error('❌ Progress error details:', {
          message: progressError.message,
          details: progressError.details,
          hint: progressError.hint,
          code: progressError.code
        });
        return false;
      }

      console.log('✅ User progress updated successfully:', progressData);
      return true;
    } catch (error) {
      console.error('❌ Unexpected error in saveQuizAttempt:', error);
      return false;
    }
  },

  async getQuizAttempts(): Promise<QuizAttempt[]> {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz attempts:', error);
      return [];
    }

    return data || [];
  },

  async getQuizAttempt(id: string): Promise<QuizAttempt | null> {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching quiz attempt:', error);
      return null;
    }

    return data;
  },
};
