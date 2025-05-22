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
  // Mock leaderboard data with Bangladeshi male names
  return [
    { userId: '1', username: 'Hasan', highestStreak: 42 },
    { userId: '2', username: 'Sajid', highestStreak: 40 },
    { userId: '3', username: 'Tanvir', highestStreak: 39 },
    { userId: '4', username: 'Rafi', highestStreak: 38 },
    { userId: '5', username: 'Fahim', highestStreak: 37 },
    { userId: '6', username: 'Nayeem', highestStreak: 36 },
    { userId: '7', username: 'Imran', highestStreak: 35 },
    { userId: '8', username: 'Zubair', highestStreak: 34 },
    { userId: '9', username: 'Shakib', highestStreak: 33 },
    { userId: '10', username: 'Rashed', highestStreak: 32 },
    { userId: '11', username: 'Arman', highestStreak: 31 },
    { userId: '12', username: 'Nabil', highestStreak: 30 },
    { userId: '13', username: 'Rayhan', highestStreak: 29 },
    { userId: '14', username: 'Tariq', highestStreak: 28 },
    { userId: '15', username: 'Shanto', highestStreak: 27 },
    { userId: '16', username: 'Mizan', highestStreak: 26 },
    { userId: '17', username: 'Asif', highestStreak: 25 },
    { userId: '18', username: 'Sabbir', highestStreak: 24 },
    { userId: '19', username: 'Raihan', highestStreak: 23 },
    { userId: '20', username: 'Aminul', highestStreak: 22 },
    { userId: '21', username: 'Ehsan', highestStreak: 21 },
    { userId: '22', username: 'Mahin', highestStreak: 20 },
    { userId: '23', username: 'Rakib', highestStreak: 19 },
    { userId: '24', username: 'Zahid', highestStreak: 18 },
  ];
};


export const submitUserResult = async (userId: string, highestStreak: number) => {
  // In a real app, submit to your backend
  console.log(`Submitted result for ${userId}: streak ${highestStreak}`);
};