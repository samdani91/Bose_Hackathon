export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  imageUrl?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserStats {
  currentStreak: number;
  highestStreak: number;
  totalCorrect: number;
  totalAttempts: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  highestStreak: number;
  avatar?: string;
}