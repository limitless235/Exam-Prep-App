import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, TrendingUp, Settings, User, Play, RotateCcw, CheckCircle, XCircle, Clock, Award, Target, Zap } from 'lucide-react';

const ExamPrepApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Alex', level: 'Intermediate', streak: 7 });
  const [quizState, setQuizState] = useState({
    questions: [],
    currentIndex: 0,
    answers: {},
    completed: false,
    score: 0,
    timeLeft: 600 // 10 minutes
  });
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample quiz data (in production, this would come from your Mistral API)
  const sampleQuestions = [
    {
      id: 1,
      question: "Which algorithm is most efficient for finding the shortest path in a weighted graph?",
      options: ["Breadth-First Search", "Dijkstra's Algorithm", "Depth-First Search", "Linear Search"],
      correct: 1,
      explanation: "Dijkstra's algorithm is specifically designed for finding shortest paths in weighted graphs with non-negative edge weights, with O((V + E) log V) complexity."
    },
    {
      id: 2, 
      question: "What is the time complexity of QuickSort in the average case?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correct: 1,
      explanation: "QuickSort has an average-case time complexity of O(n log n) due to the divide-and-conquer approach with balanced partitions."
    },
    {
      id: 3,
      question: "Which data structure uses LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1,
      explanation: "A Stack follows the LIFO principle where the last element added is the first one to be removed, like a stack of plates."
    }
  ];

  const generateQuiz = async () => {
    setLoading(true);
    // Simulate API call to your FastAPI backend with Mistral model
    setTimeout(() => {
      setQuizState({
        questions: sampleQuestions,
        currentIndex: 0,
        answers: {},
        completed: false,
        score: 0,
        timeLeft: 600
      });
      setIsQuizActive(true);
      setCurrentView('quiz');
      setLoading(false);
    }, 1500);
  };

  const selectAnswer = (questionId, answerIndex) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answerIndex }
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const score = quizState.questions.reduce((acc, q) => {
      return acc + (quizState.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    
    setQuizState(prev => ({
      ...prev,
      completed: true,
      score: score
    }));
    setIsQuizActive(false);
    setCurrentView('results');
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentIndex: 0,
      answers: {},
      completed: false,
      score: 0,
      timeLeft: 600
    });
    setCurrentView('dashboard');
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (isQuizActive && quizState.timeLeft > 0) {
      timer = setInterval(() => {
        setQuizState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (quizState.timeLeft === 0) {
      completeQuiz();
    }
    return () => clearInterval(timer);
  }, [isQuizActive, quizState.timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const DashboardView = () => (
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
        <p className="text-gray-600 text-lg">Powered by Mistral 7B • Adaptive Learning</p>
      </div>

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
              <p className="text-sm text-purple-600 font-medium">AI Accuracy</p>
              <p className="text-2xl font-bold text-purple-700">85%+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={generateQuiz}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating AI Quiz...</span>
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
            onClick={() => setCurrentView('performance')}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Performance</span>
          </button>
          
          <button
            onClick={() => setCurrentView('settings')}
            className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  const QuizView = () => {
    const currentQuestion = quizState.questions[quizState.currentIndex];
    const selectedAnswer = quizState.answers[currentQuestion?.id];
    
    return (
      <div className="space-y-6">
        {/* Quiz Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Question {quizState.currentIndex + 1} of {quizState.questions.length}</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((quizState.currentIndex + 1) / quizState.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-orange-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(quizState.timeLeft)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion?.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(currentQuestion.id, index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={resetQuiz}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Exit Quiz</span>
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={selectedAnswer === undefined}
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span>{quizState.currentIndex === quizState.questions.length - 1 ? 'Complete Quiz' : 'Next Question'}</span>
          </button>
        </div>
      </div>
    );
  };

  const ResultsView = () => {
    const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
    
    return (
      <div className="space-y-8">
        {/* Results Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 rounded-full ${percentage >= 70 ? 'bg-green-100' : 'bg-orange-100'}`}>
              {percentage >= 70 ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-orange-600" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Quiz Complete!</h1>
          <p className="text-gray-600">Here's how you performed</p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-blue-600">{percentage}%</div>
            <p className="text-lg text-gray-700">
              You scored {quizState.score} out of {quizState.questions.length} questions correctly
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Question Review</h2>
          {quizState.questions.map((question, index) => {
            const userAnswer = quizState.answers[question.id];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div key={question.id} className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="font-medium text-gray-800">{question.question}</p>
                    <div className="space-y-2">
                      <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        Your answer: {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600">
                          Correct answer: {question.options[question.correct]}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>AI Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={generateQuiz}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Take Another Quiz
          </button>
          <button
            onClick={resetQuiz}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">AI Exam Prep</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border shadow-sm">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">{user.name}</span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border p-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'quiz' && <QuizView />}
          {currentView === 'results' && <ResultsView />}
          {currentView === 'performance' && (
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Performance Analytics</h2>
              <p className="text-gray-600">Coming soon - detailed performance tracking and insights</p>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
          {currentView === 'settings' && (
            <div className="text-center py-16">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
              <p className="text-gray-600">Customize your learning experience</p>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPrepApp;