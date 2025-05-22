import React, { useState, useEffect } from 'react';
import { User, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  image?: string;
  occupation?: string;
}

const AllUserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [initialUsers, setInitialUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/allUsers`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          const sortedUsers = (data.users || []).sort((a: User, b: User) =>
            a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
          );
          setUsers(sortedUsers);
          setInitialUsers(sortedUsers);
        } else {
          toast.error('Failed to fetch users');
        }
      } catch (err) {
        toast.error('Something went wrong while fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = initialUsers.filter(
        (u) =>
          u.name.trim().toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.occupation && u.occupation.trim().toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setUsers(filtered);
    } else {
      setUsers(initialUsers);
    }
  }, [searchQuery, initialUsers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <form className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search users by name or occupation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-slate-900">Loading users...</h3>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${user.name} avatar`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-500" />
                </div>
              )}
              <div>
                <Link
                  to={`/profile/${user._id}`}
                  className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {user.name}
                </Link>
                <p className="text-sm text-slate-500">{user.occupation || 'No occupation provided'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-slate-900">No users found</h3>
          <p className="mt-1 text-slate-500">Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};

export default AllUserListPage;