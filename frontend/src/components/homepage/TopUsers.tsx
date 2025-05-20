import type { User } from '../../types/';
import { Link } from '../ui/Link';
import { Badge } from '../ui/Badge';

interface TopUsersProps {
  users: User[];
}

export const TopUsers = ({ users }: TopUsersProps) => {
  const sortedUsers = [...users].sort((a, b) => b.reputation - a.reputation);
  
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-slate-900 mb-3">Top Users</h3>
      <ul className="divide-y divide-slate-200">
        {sortedUsers.map(user => (
          <li key={user.id} className="py-3 flex items-center">
            <div className="flex-shrink-0">
              {user.avatarUrl ? (
                <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.displayName} />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-medium">{user.displayName.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <Link to={`/users/${user.id}`} className="text-sm font-medium text-slate-900 hover:text-indigo-600">
                {user.displayName}
              </Link>
              <p className="text-xs text-slate-500">Reputation: {user.reputation.toLocaleString()}</p>
            </div>
            <div className="flex-shrink-0 flex gap-1">
              {user.badges.filter(badge => badge.type === 'gold').length > 0 && (
                <Badge variant="warning" className="bg-amber-200 text-amber-800">
                  {user.badges.filter(badge => badge.type === 'gold').length}
                </Badge>
              )}
              {user.badges.filter(badge => badge.type === 'silver').length > 0 && (
                <Badge className="bg-slate-200 text-slate-800">
                  {user.badges.filter(badge => badge.type === 'silver').length}
                </Badge>
              )}
              {user.badges.filter(badge => badge.type === 'bronze').length > 0 && (
                <Badge className="bg-amber-100 text-amber-800">
                  {user.badges.filter(badge => badge.type === 'bronze').length}
                </Badge>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};