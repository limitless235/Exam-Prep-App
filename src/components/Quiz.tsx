
import React from 'react';
import { BookOpen, Clock, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizProps {
  quizState: {
    questions: QuizQuestion[];
    currentIndex: number;
    answers: Record<number, number>;
    timeLeft: number;
  };
  onSelectAnswer: (questionId: string | number, answerIndex: number) => void;
  onNextQuestion: () => void;
  onResetQuiz: () => void;
}

const Quiz: React.FC<QuizProps> = ({
  quizState,
  onSelectAnswer,
  onNextQuestion,
  onResetQuiz
}) => {
  const currentQuestion = quizState.questions[quizState.currentIndex];
  const selectedAnswer = quizState.answers[currentQuestion?.id];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              onClick={() => onSelectAnswer(currentQuestion.id, index)}
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
          onClick={onResetQuiz}
          className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Exit Quiz</span>
        </button>
        
        <button
          onClick={onNextQuestion}
          disabled={selectedAnswer === undefined}
          className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <span>{quizState.currentIndex === quizState.questions.length - 1 ? 'Complete Quiz' : 'Next Question'}</span>
        </button>
      </div>
    </div>
  );
};

export default Quiz;
