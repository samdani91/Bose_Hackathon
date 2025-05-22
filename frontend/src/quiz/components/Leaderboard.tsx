import type { LeaderboardEntry } from '../types/quiz';
import { Link } from 'react-router-dom';
import { ArrowLeft, Atom, FlaskConical, Rocket, Trophy } from 'lucide-react'; // Added Trophy import

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export const Leaderboard = ({ entries }: LeaderboardProps) => {
  // Sort entries by highestStreak in descending order
  const sortedEntries = [...entries].sort((a, b) => b.highestStreak - a.highestStreak);

  // Science-themed badge components
  const Badge = ({ position }: { position: number }) => {
    const badgeConfig = {
      1: {
        color: 'bg-yellow-400 text-yellow-900',
        icon: <Rocket className="w-4 h-4" />,
        label: 'Gold'
      },
      2: {
        color: 'bg-gray-300 text-gray-700',
        icon: <FlaskConical className="w-4 h-4" />,
        label: 'Silver'
      },
      3: {
        color: 'bg-amber-600 text-amber-100',
        icon: <Atom className="w-4 h-4" />,
        label: 'Bronze'
      }
    };

    if (position > 3) return null;

    return (
      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badgeConfig[position].color}`}>
        {badgeConfig[position].icon}
        {badgeConfig[position].label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/quizzes" 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Quiz
          </Link>
          {/* <h1 className="text-2xl font-bold text-indigo-800">Science Leaderboard</h1> */}
          {/* <div className="w-24"></div>  */}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Leaderboard
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Top science enthusiasts by consecutive correct answers
            </p>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {sortedEntries.map((entry, index) => (
              <li key={entry.userId} className={`p-4 hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-opacity-10' : ''} ${
                index === 0 ? 'bg-yellow-50' : 
                index === 1 ? 'bg-gray-50' : 
                index === 2 ? 'bg-amber-50' : ''
              }`}>
                <div className="flex items-center">
                  <span className={`w-8 text-center font-medium ${
                    index === 0 ? 'text-yellow-600' : 
                    index === 1 ? 'text-gray-600' : 
                    index === 2 ? 'text-amber-700' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  
                  {entry.avatar ? (
                    <img 
                      src={entry.avatar} 
                      alt={entry.username} 
                      className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full mr-3 bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{entry.username}</span>
                    <div className="text-xs text-gray-500">
                      {entry.highestStreak} correct answers in a row
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {entry.highestStreak}
                    </span>
                    <Badge position={index + 1} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {sortedEntries.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No entries yet. Be the first to top the leaderboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};