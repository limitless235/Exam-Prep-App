
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface ResultsProps {
  quizState: {
    questions: QuizQuestion[];
    answers: Record<number, number>;
    score: number;
  };
  onGenerateQuiz: () => void;
  onResetQuiz: () => void;
}

const Results: React.FC<ResultsProps> = ({
  quizState,
  onGenerateQuiz,
  onResetQuiz
}) => {
  const percentage = Math.round((quizState.score / quizState.questions.length) * 100);

  const handleGenerateQuiz = () => {
    console.log('🔄 Generate new quiz button clicked');
    onGenerateQuiz();
  };

  const handleResetQuiz = () => {
    console.log('🏠 Back to dashboard button clicked');
    onResetQuiz();
  };

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
          const isCorrect = userAnswer === question.correctAnswer;
          
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
                        Correct answer: {question.options[question.correctAnswer]}
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
          onClick={handleGenerateQuiz}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
        >
          Take Another Quiz
        </button>
        <button
          onClick={handleResetQuiz}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Results;
