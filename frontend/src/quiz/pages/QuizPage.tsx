import { useState, useEffect } from 'react';
import { QuizCard } from '../components/QuizCard';
import { StreakCounter } from '../components/StreakCounter';
import { fetchQuizQuestions } from '../api/quiz';
import { useQuiz } from '../hooks/useQuiz';
import { Toaster, toast } from 'sonner';
import type { QuizQuestion } from '../types/quiz';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy } from 'lucide-react';

// Define available quiz topics
const QUIZ_TOPICS = [
  { id: 'all', name: 'All Topics' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'astronomy', name: 'Astronomy' },
  { id: 'math', name: 'Mathematics' },
  { id: 'miscellaneous', name: 'Miscellaneous' },
];

export const QuizPage = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  
  const {
    currentQuestion,
    selectedOption,
    isAnswered,
    score,
    currentStreak,
    highestStreak,
    handleAnswer,
    nextQuestion,
    currentQuestionIndex,
    totalQuestions,
  } = useQuiz(questions);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchQuizQuestions();
        // Filter questions by selected topic if not 'all'
        const filteredQuestions = selectedTopic === 'all' 
          ? data 
          : data.filter(q => q.category.toLowerCase() === selectedTopic);
        setQuestions(filteredQuestions);
      } catch (error) {
        toast.error('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [selectedTopic]);

  const handleTopicChange = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  if (loading) {
    return <div className="text-center py-10">Loading questions...</div>;
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-10">
        <p>No questions available for this topic.</p>
        <button
          onClick={() => setSelectedTopic('all')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to All Topics
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-indigo-800">Science Quiz</h1>
            <p className="text-sm text-gray-500">Test your knowledge across various science topics</p>
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

        {/* Topic Selection */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Select Topic:</h2>
          <div className="flex flex-wrap gap-2">
            {QUIZ_TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => handleTopicChange(topic.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTopic === topic.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>

        <StreakCounter current={currentStreak} highest={highestStreak} />
        
        <div className="mb-6 text-center">
          <span className="text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        
        <QuizCard 
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={isAnswered}
        />
        
        {isAnswered && (
          <div className="mt-6 text-center">
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
        
        {isAnswered && (
          <div className={`mt-4 text-center text-lg font-medium ${selectedOption === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
            {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : `Incorrect! The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
          </div>
        )}
      </div>
    </div>
  );
};