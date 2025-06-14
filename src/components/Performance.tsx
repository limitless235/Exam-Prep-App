
import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { userService, QuizAttempt } from '../services/userService';

interface PerformanceProps {
  onNavigate: (view: string) => void;
}

const Performance: React.FC<PerformanceProps> = ({ onNavigate }) => {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizAttempts();
  }, []);

  const loadQuizAttempts = async () => {
    setLoading(true);
    const attempts = await userService.getQuizAttempts();
    setQuizAttempts(attempts);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (selectedQuiz) {
    return (
      <div className="space-y-6">
        {/* Quiz Details Header */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedQuiz(null)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Performance
            </button>
            <div className="text-sm text-gray-500">
              {formatDate(selectedQuiz.completed_at)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{selectedQuiz.score_percentage}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{selectedQuiz.correct_answers}/{selectedQuiz.total_questions}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{formatTime(selectedQuiz.time_taken)}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{selectedQuiz.subject}</div>
              <div className="text-sm text-gray-600">Subject</div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Question Review</h2>
          {selectedQuiz.questions_data.map((question: any, index: number) => {
            const userAnswer = selectedQuiz.user_answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className={`w-6 h-6 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      <span className="flex items-center justify-center h-full text-white text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="font-medium text-gray-800">{question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option: string, optionIndex: number) => {
                        const isSelected = userAnswer === optionIndex;
                        const isCorrectOption = question.correctAnswer === optionIndex;
                        
                        let optionClass = 'p-3 rounded-lg border ';
                        if (isSelected && isCorrect) {
                          optionClass += 'bg-green-50 border-green-300 text-green-700';
                        } else if (isSelected && !isCorrect) {
                          optionClass += 'bg-red-50 border-red-300 text-red-700';
                        } else if (isCorrectOption) {
                          optionClass += 'bg-green-50 border-green-300 text-green-700';
                        } else {
                          optionClass += 'bg-gray-50 border-gray-200 text-gray-700';
                        }
                        
                        return (
                          <div key={optionIndex} className={optionClass}>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span>{option}</span>
                              {isSelected && (
                                <span className="text-xs ml-auto">Your answer</span>
                              )}
                              {isCorrectOption && !isSelected && (
                                <span className="text-xs ml-auto">Correct answer</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {question.explanation && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Performance Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Performance Analytics</h1>
        <p className="text-gray-600">Track your quiz history and analyze your progress</p>
      </div>

      {/* Performance Overview */}
      {quizAttempts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Quizzes</p>
                <p className="text-2xl font-bold text-blue-700">{quizAttempts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Average Score</p>
                <p className="text-2xl font-bold text-green-700">
                  {Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.score_percentage, 0) / quizAttempts.length)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Best Score</p>
                <p className="text-2xl font-bold text-purple-700">
                  {Math.max(...quizAttempts.map(a => a.score_percentage))}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz History */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Quiz History</h2>
          <p className="text-gray-600 mt-1">Click on any quiz to view detailed results</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading quiz history...</p>
            </div>
          ) : quizAttempts.length === 0 ? (
            <div className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No quizzes yet</h3>
              <p className="text-gray-600 mb-4">Take your first quiz to see your performance analytics!</p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start a Quiz
              </button>
            </div>
          ) : (
            quizAttempts.map((attempt) => (
              <div
                key={attempt.id}
                onClick={() => setSelectedQuiz(attempt)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(attempt.score_percentage)}`}>
                        {attempt.score_percentage}%
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {attempt.subject} - {attempt.difficulty}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {attempt.correct_answers}/{attempt.total_questions} correct • {formatTime(attempt.time_taken)} • {formatDate(attempt.completed_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="text-center">
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Performance;
