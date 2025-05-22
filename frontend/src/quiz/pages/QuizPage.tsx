import { useState, useEffect, useCallback } from 'react';
import { QuizCard } from '../components/QuizCard';
import { StreakCounter } from '../components/StreakCounter';
import { fetchQuizQuestions } from '../api/quiz';
import { useStreak } from '../hooks/useStreak'; // Import useStreak directly
import { Toaster, toast } from 'sonner';
import Cookies from 'js-cookie';
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
  
  // Cookie-based streak state
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [lastQuizDate, setLastQuizDate] = useState<string | null>(null);

  // Cookie keys
  const CURRENT_STREAK_KEY = 'quiz_current_streak';
  const HIGHEST_STREAK_KEY = 'quiz_highest_streak';
  const LAST_QUIZ_DATE_KEY = 'quiz_last_date';

  // Initialize streak data from cookies
  useEffect(() => {
    const savedCurrentStreak = parseInt(Cookies.get(CURRENT_STREAK_KEY) || '0');
    const savedHighestStreak = parseInt(Cookies.get(HIGHEST_STREAK_KEY) || '0');
    const savedLastQuizDate = Cookies.get(LAST_QUIZ_DATE_KEY);

    setCurrentStreak(savedCurrentStreak);
    setHighestStreak(savedHighestStreak);
    setLastQuizDate(savedLastQuizDate || null);

    // Check if streak should be reset (if more than 24 hours have passed)
    if (savedLastQuizDate) {
      const lastDate = new Date(savedLastQuizDate);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
      
      // If more than 24 hours have passed, reset current streak
      if (hoursDiff > 24) {
        setCurrentStreak(0);
        Cookies.set(CURRENT_STREAK_KEY, '0', { expires: 365 });
      }
    }
  }, []);

  // Add this function to your component
  const updateStreakOnServer = async (streakValue: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/streak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streak: streakValue }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update streak on server');
      }
      
      console.log('Streak updated successfully on server');
    } catch (error) {
      console.error('Error updating streak:', error);
      // Optionally show a toast, but silent failure might be better for this
      // toast.error('Failed to update leaderboard');
    }
  };

  // Then modify your incrementStreak function
  const incrementStreak = () => {
    const newCurrentStreak = currentStreak + 1;
    const newHighestStreak = Math.max(highestStreak, newCurrentStreak);
    const currentDate = new Date().toISOString();

    setCurrentStreak(newCurrentStreak);
    setHighestStreak(newHighestStreak);
    setLastQuizDate(currentDate);

    // Save to cookies (expires in 1 year)
    Cookies.set(CURRENT_STREAK_KEY, newCurrentStreak.toString(), { expires: 365 });
    Cookies.set(HIGHEST_STREAK_KEY, newHighestStreak.toString(), { expires: 365 });
    Cookies.set(LAST_QUIZ_DATE_KEY, currentDate, { expires: 365 });

    // Update streak on server if it's a new highest streak
    if (newCurrentStreak >= highestStreak) {
      updateStreakOnServer(newCurrentStreak);
    }
  };

  // Function to reset current streak
  const resetStreak = () => {
    const currentDate = new Date().toISOString();
    
    setCurrentStreak(0);
    setLastQuizDate(currentDate);

    // Save to cookies
    Cookies.set(CURRENT_STREAK_KEY, '0', { expires: 365 });
    Cookies.set(LAST_QUIZ_DATE_KEY, currentDate, { expires: 365 });
    // Don't reset highest streak
  };

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
    
    if (option === correctIndex) {
      incrementStreak();

      toast.success(`Correct answer! Streak: ${currentStreak + 1}`, { duration: 2000 });
    } else {
      resetStreak();
      toast.error('Incorrect answer! Streak reset.', { duration: 2000 });
    }
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
  }, []);

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
            onClick={() => {
              setLoading(true);
              fetchNextQuestion();
            }}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {loading ? (
              <>
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          Loading...
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* <Toaster position="bottom-center" /> */}
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