export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
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