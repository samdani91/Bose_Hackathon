import { useState, useEffect, useCallback } from 'react';
import { QuizCard } from '../components/QuizCard';
import { StreakCounter } from '../components/StreakCounter';
import { fetchQuizQuestions } from '../api/quiz';
import { useStreak } from '../hooks/useStreak'; // Import useStreak directly
import { Toaster, toast } from 'sonner';
import type { QuizQuestion } from '../types/quiz';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy } from 'lucide-react';

export const QuizPage = () => {
  // State for the current question and question number
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Get streak functionality directly
  const { currentStreak, highestStreak, incrementStreak, resetStreak } = useStreak();

  // Helper function to convert letter to index
  const getCorrectAnswerIndex = (answer: string): number => {
    return answer.charCodeAt(0) - 65; // A=0, B=1, C=2, etc.
  };

  // Function to handle answer selection
  const handleAnswer = (option: number) => {
    if (isAnswered || !currentQuestion) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    const correctIndex = getCorrectAnswerIndex(currentQuestion.correctAnswer);
    
    // if (option === correctIndex) {
    //   incrementStreak();
    //   toast.success('Correct answer!', { duration: 1500 });
    // } else {
    //   resetStreak();
    //   toast.error('Incorrect answer!', { duration: 1500 });
    // }
  };

  // Function to fetch a new question
  const fetchNextQuestion = useCallback(async () => {
    try {
      setLoading(true);
      const questions = await fetchQuizQuestions();
      
      if (questions && questions.length > 0) {
        setCurrentQuestion(questions[0]);
        setSelectedOption(null);
        setIsAnswered(false);
        setCurrentQuestionNumber(prev => prev + 1);
      } else {
        toast.error('No question available');
      }
    } catch (error) {
      toast.error('Failed to load next question');
      console.error('Error loading next question:', error);
    } finally {
      setLoading(false);
    }
  }, [currentStreak]);

  // Initial question load
  useEffect(() => {
    fetchNextQuestion();
  }, [fetchNextQuestion]);

  if (loading && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-10 max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">We couldn't find any quiz questions right now. Please try again later.</p>
          <button
            onClick={fetchNextQuestion}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-indigo-800">Knowledge Quiz</h1>
            <p className="text-sm text-gray-500">Test your knowledge and improve your streak!</p>
          </div>
          <Link 
            to="/quizzes/leaderboard" 
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <Trophy size={18} />
            Leaderboard
            <ChevronRight size={18} />
          </Link>
        </div>

        <StreakCounter current={currentStreak} highest={highestStreak} />
        
        <div className="mb-6 text-center">
          <span className="text-gray-600">
            Question {currentQuestionNumber}
          </span>
        </div>
        

        
        <QuizCard 
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={isAnswered}
          selectedOption={selectedOption}
        />
        
        {isAnswered && (
          <div className="mt-6 text-center">
            <button
              onClick={fetchNextQuestion}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
        
        {isAnswered && (
          <div className={`mt-4 text-center text-lg font-medium ${selectedOption === getCorrectAnswerIndex(currentQuestion.correctAnswer)
              ? 'text-green-600'
              : 'text-red-600'
            }`}>
            {selectedOption === getCorrectAnswerIndex(currentQuestion.correctAnswer)
              ? 'Correct!'
              : (
                <span>
                  Incorrect! The correct answer is: {' '}
                  <span className="font-bold">
                    {currentQuestion.correctAnswer}. {' '}
                    {currentQuestion.options[getCorrectAnswerIndex(currentQuestion.correctAnswer)]}
                  </span>
                </span>
              )
            }
          </div>
        )}
      </div>
    </div>
  );
};