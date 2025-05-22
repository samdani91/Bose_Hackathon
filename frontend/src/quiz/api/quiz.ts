import type { QuizQuestion, LeaderboardEntry } from '../types/quiz';


export const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  // const topics = ['astronomy', 'tech', 'physics', 'chemistry', 'science'];
  // const topic = topics[Math.floor(Math.random() * topics.length)];

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/quiz`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: "easy, interesting but confusing science",
        streak: 10,
      }),
      credentials: 'include',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch quiz questions');
  }
  const data = await response.json();
  console.log('Fetched quiz from api:', data.quiz);
  
  // Map the API response to QuizQuestion[]
  const questions: QuizQuestion[] = [
    {
      question: data.quiz.question,
      options: data.quiz.options,
      correctAnswer: data.quiz.correctAnswer,
    }
  ];
  
  return questions;
};


export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/streak`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    
    const data = await response.json();
    console.log('Fetched leaderboard data:', data);
    
    // Assuming the API returns an array of users with streaks
    // Map to the LeaderboardEntry format
    return data.map((user: any) => ({
      userId: user.id || user._id,
      username: user.username || user.name,
      highestStreak: user.streak || 0,
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return []; // Return empty array on error
  }
};


export const submitUserResult = async (userId: string, highestStreak: number) => {
  // In a real app, submit to your backend
  console.log(`Submitted result for ${userId}: streak ${highestStreak}`);
};