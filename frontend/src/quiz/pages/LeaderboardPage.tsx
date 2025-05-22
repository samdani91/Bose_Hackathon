import { useState, useEffect } from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { fetchLeaderboard } from '../api/quiz';
import type{ LeaderboardEntry } from '../types/quiz';
// import { Toaster } from 'sonner';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to load leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading leaderboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Science Quiz Leaderboard</h1>
        <Leaderboard entries={leaderboard} />
      </div>
    </div>
  );
};