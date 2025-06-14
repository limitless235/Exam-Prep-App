
import React from 'react';
import { Brain, Award, Target, Zap, Play, TrendingUp, Settings, Download } from 'lucide-react';
import { quizGeneratorService } from '../services/quizGenerator';

interface DashboardProps {
  user: {
    name: string;
    level: string;
    streak: number;
  };
  loading: boolean;
  modelProgress: {
    progress: number;
    stage: string;
  };
  onGenerateQuiz: () => void;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  loading,
  modelProgress,
  onGenerateQuiz,
  onNavigate
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Exam Prep
        </h1>
        <p className="text-gray-600 text-lg">Powered by Mistral-7B • Good Luck</p>
      </div>

      {/* Model Status */}
      {!quizGeneratorService.isModelReady() && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-amber-600 font-medium">AI Model Status</p>
              <p className="text-lg font-bold text-amber-700">Ready to download on first use</p>
              <p className="text-sm text-amber-600">Model will cache in your browser for future use</p>
            </div>
          </div>
        </div>
      )}

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Current Streak</p>
              <p className="text-2xl font-bold text-green-700">{user.streak} days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Skill Level</p>
              <p className="text-2xl font-bold text-blue-700">{user.level}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Exam Ready</p>
              <p className="text-2xl font-bold text-purple-700">Prep Mode</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={onGenerateQuiz}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{modelProgress.stage || 'Generating AI Quiz...'}</span>
              </div>
              {modelProgress.progress > 0 && (
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${modelProgress.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Play className="w-6 h-6" />
              <span>Start AI-Generated Quiz</span>
            </div>
          )}
        </button>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('performance')}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Performance</span>
          </button>
          
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
