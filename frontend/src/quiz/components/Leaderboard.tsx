import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  streak: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  users: User[];
  message: string;
}

export const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/streak`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data: ApiResponse = await response.json();
        console.log('Fetched leaderboard data:', data);
        // Sort users by streak in descending order
        const sortedUsers = [...data.users].sort((a, b) => b.streak - a.streak);
        setUsers(sortedUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const Badge = ({ position }: { position: number }) => {
    if (position > 3) return null;

    const badgeConfig: Record<1 | 2 | 3, { color: string; icon: string; label: string }> = {
      1: {
        color: 'bg-yellow-400 text-yellow-900',
        icon: '🥇',
        label: 'Gold'
      },
      2: {
        color: 'bg-gray-300 text-gray-700',
        icon: '🥈',
        label: 'Silver'
      },
      3: {
        color: 'bg-amber-600 text-amber-100',
        icon: '🥉',
        label: 'Bronze'
      }
    };

    return (
      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badgeConfig[position as 1 | 2 | 3].color}`}>
        {badgeConfig[position as 1 | 2 | 3].icon}
        {badgeConfig[position as 1 | 2 | 3].label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            ← Back
          </button>
          {/* <h1 className="text-2xl font-bold text-indigo-800">Leaderboard</h1> */}
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              🏆 Leaderboard
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Top performers by streak
            </p>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <li key={user._id} className={`p-4 hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-opacity-10' : ''} ${
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
                  
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-100 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full mr-3 bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{user.name}</span>
                    <div className="text-xs text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {user.streak}
                    </span>
                    <Badge position={index + 1} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No entries yet. Be the first to top the leaderboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;