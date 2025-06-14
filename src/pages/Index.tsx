import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { quizGeneratorService } from '../services/quizGenerator';
import { userService, UserProfile } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { QuizQuestion } from '../types';

// Components
import Auth from '../components/Auth';
import Dashboard from '../components/Dashboard';
import Quiz from '../components/Quiz';
import Results from '../components/Results';
import Performance from '../components/Performance';
import Settings from '../components/Settings';
import EditableUsername from '../components/EditableUsername';

interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<number, number>;
  timeLeft: number;
  score: number;
}

interface AppSettings {
  subject: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  autoSubmit: boolean;
  showExplanations: boolean;
  soundEffects: boolean;
}

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  
  // App state
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    answers: {},
    timeLeft: 600,
    score: 0,
  });

  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    subject: 'Computer Science',
    difficulty: 'Intermediate',
    questionCount: 5,
    timeLimit: 10,
    autoSubmit: true,
    showExplanations: true,
    soundEffects: false,
  });

  // Model progress state
  const [modelProgress, setModelProgress] = useState({
    progress: 0,
    stage: '',
  });

  // Load user profile when authenticated
  useEffect(() => {
    if (user) {
      console.log('🔍 User authenticated, loading profile for:', user.id);
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    console.log('📋 Loading user profile...');
    const profile = await userService.getUserProfile();
    console.log('📋 User profile loaded:', profile);
    setUserProfile(profile);
  };

  const handleUpdateUsername = async (newName: string): Promise<boolean> => {
    console.log('📝 Updating username to:', newName);
    const success = await userService.updateUserName(newName);
    if (success) {
      toast({
        title: "Name Updated",
        description: "Your display name has been updated successfully.",
      });
      // Immediately reload user profile to reflect the change
      await loadUserProfile();
      return true;
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update your display name. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Timer effect
  useEffect(() => {
    if (currentView === 'quiz' && quizState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentView === 'quiz' && quizState.timeLeft === 0 && settings.autoSubmit) {
      handleCompleteQuiz();
    }
  }, [currentView, quizState.timeLeft, settings.autoSubmit]);

  const generateQuiz = async () => {
    setLoading(true);
    setModelProgress({ progress: 0, stage: 'Initializing AI model...' });

    try {
      const questions = await quizGeneratorService.generateQuiz(
        settings.subject,
        settings.difficulty,
        settings.questionCount,
        (progress, stage) => {
          setModelProgress({ progress, stage });
        }
      );

      if (questions && questions.length > 0) {
        setQuizState({
          questions,
          currentIndex: 0,
          answers: {},
          timeLeft: settings.timeLimit * 60,
          score: 0,
        });
        setCurrentView('quiz');
      } else {
        toast({
          title: "Quiz Generation Failed",
          description: "Unable to generate quiz questions. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setModelProgress({ progress: 0, stage: '' });
    }
  };

  const selectAnswer = (questionId: string | number, answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answerIndex }
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = async () => {
    console.log('🎯 Starting quiz completion process...');
    console.log('🎯 Current user:', user);
    console.log('🎯 Quiz state:', quizState);
    console.log('🎯 Settings:', settings);

    let correctCount = 0;
    quizState.questions.forEach(question => {
      if (quizState.answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / quizState.questions.length) * 100);
    const timeTaken = (settings.timeLimit * 60) - quizState.timeLeft;

    console.log('🎯 Calculated results:', {
      correctCount,
      totalQuestions: quizState.questions.length,
      scorePercentage,
      timeTaken
    });

    // Save quiz attempt to database if user is logged in
    if (user) {
      console.log('🎯 User is logged in, attempting to save quiz...');
      try {
        const success = await userService.saveQuizAttempt(
          settings.subject,
          settings.difficulty,
          quizState.questions.length,
          correctCount,
          scorePercentage,
          timeTaken,
          quizState.questions,
          quizState.answers
        );

        console.log('🎯 Save quiz attempt result:', success);

        if (success) {
          console.log('🎯 Quiz saved successfully, reloading profile...');
          // Reload user profile to get updated stats
          await loadUserProfile();
          toast({
            title: "Quiz Completed!",
            description: `Your progress has been saved. Score: ${scorePercentage}%`,
          });
        } else {
          console.log('🎯 Quiz save failed');
          toast({
            title: "Quiz Completed",
            description: `Score: ${scorePercentage}% (Progress not saved)`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('🎯 Error saving quiz attempt:', error);
        toast({
          title: "Quiz Completed",
          description: `Score: ${scorePercentage}% (Error saving progress)`,
          variant: "destructive",
        });
      }
    } else {
      console.log('🎯 No user logged in, cannot save quiz');
    }

    setQuizState(prev => ({ ...prev, score: correctCount }));
    setCurrentView('results');
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentIndex: 0,
      answers: {},
      timeLeft: 600,
      score: 0,
    });
    setCurrentView('dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    setUserProfile(null);
    resetQuiz();
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const saveSettings = () => {
    // Settings are automatically saved to state
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
    setCurrentView('dashboard');
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return (
      <>
        <Auth onAuthSuccess={() => setCurrentView('dashboard')} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info and sign out */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-lg text-gray-600">Welcome</span>
            <EditableUsername
              currentName={userProfile?.name || user.email || 'Student'}
              onSave={handleUpdateUsername}
            />
          </div>
          <button
            onClick={handleSignOut}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Main content */}
        {currentView === 'dashboard' && (
          <Dashboard
            user={{
              name: userProfile?.name || 'Student',
              level: userProfile?.skill_level || 'Beginner',
              streak: userProfile?.current_streak || 0,
            }}
            loading={loading}
            modelProgress={modelProgress}
            onGenerateQuiz={generateQuiz}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'quiz' && (
          <Quiz
            quizState={quizState}
            onSelectAnswer={selectAnswer}
            onNextQuestion={nextQuestion}
            onResetQuiz={resetQuiz}
          />
        )}

        {currentView === 'results' && (
          <Results
            quizState={quizState}
            onGenerateQuiz={generateQuiz}
            onResetQuiz={resetQuiz}
          />
        )}

        {currentView === 'performance' && (
          <Performance onNavigate={setCurrentView} />
        )}

        {currentView === 'settings' && (
          <Settings
            settings={settings}
            onUpdateSettings={updateSettings}
            onSaveSettings={saveSettings}
            onNavigate={setCurrentView}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
