import type { QuizQuestion, LeaderboardEntry } from '../types/quiz';

// Mock data - replace with actual API calls
const mockQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    category: 'Chemistry',
    difficulty: 'easy',
    imageUrl: 'https://example.com/gold.jpg'
  },
  // More questions...
];

export const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  // In a real app, you would fetch from your API
  return mockQuestions;
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Mock leaderboard data
  return [
    { userId: '1', username: 'Einstein', highestStreak: 42 },
    { userId: '2', username: 'Curie', highestStreak: 38 },
    // More entries...
  ];
};

export const submitUserResult = async (userId: string, highestStreak: number) => {
  // In a real app, submit to your backend
  console.log(`Submitted result for ${userId}: streak ${highestStreak}`);
};