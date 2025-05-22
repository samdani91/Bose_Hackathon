import React, { useState, useEffect } from 'react';
import { Search, Menu, X, MessageCircle, Bell, User, Settings, UserCircle, LogIn, LogOut } from 'lucide-react';
import { Link } from '../ui/Link';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface UserData {
  _id: string;
  name: string;
  image?: string;
}

interface QuestionData {
  _id: string;
  title: string;
  tags: string[];
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("isAuthenticatedToFactRush") === "true");
  const [userId, setUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ title: string; id: string; type: string; image?: string }[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticatedToFactRush') === 'true';
      setLoggedIn(isAuthenticated);
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    const intervalId = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/getUserId`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error fetching user ID:', errorData.message);
          return;
        }

        const data = await response.json();
        setUserId(data.user_id);
      } catch (err) {
        console.error('Fetch user ID error:', err);
      }
    };

    if(loggedIn) fetchUserId();
  }, [loggedIn]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/allUsers`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users || []);
        } else {
          toast.error('Failed to fetch users');
        }
      } catch (err) {
        toast.error('Something went wrong while fetching users');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setQuestions(data.questions || []);
        } else {
          toast.error('Failed to fetch questions');
        }
      } catch (err) {
        toast.error('Something went wrong while fetching questions');
      }
    };

    fetchQuestions();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 3) {
      const results = [
        ...users
          .filter((user) => user.name.trim().toLowerCase().includes(query.toLowerCase()))
          .map((user) => ({
            title: user.name,
            id: user._id,
            type: 'User',
            image: user.image,
          })),
        ...questions
          .filter((question) =>
            question.title.trim().toLowerCase().includes(query.toLowerCase()) ||
            question.tags.some((tag) => tag.trim().toLowerCase().includes(query.toLowerCase()))
          )
          .map((question) => ({
            title: question.title,
            id: question._id,
            type: 'Question',
          })),
      ];
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (id: string, type: string) => {
    setSearchQuery('');
    setSearchResults([]);
    if (type === 'User') {
      navigate(`/profile/${id}`);
    } else if (type === 'Question') {
      navigate(`/question/${id}`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log out');
      }

      localStorage.removeItem('isAuthenticatedToFactRush');
      localStorage.removeItem('accessToken');
      setLoggedIn(false);
      toast.success(data.message || 'Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out');
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <MessageCircle className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-slate-800">FactRush</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-indigo-500 text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex items-center">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-slate-300 rounded-md h-9"
                placeholder="Search..."
              />
              {searchResults.length > 0 && (
                <ul className="absolute left-0 mt-2 w-full bg-white text-black rounded-md shadow-lg z-10">
                  {searchResults.map((result, index) => (
                    <React.Fragment key={result.id}>
                      <li
                        className="px-4 py-2 hover:bg-slate-100 hover:rounded-md cursor-pointer flex items-center"
                        onClick={() => handleSearchResultClick(result.id, result.type)}
                      >
                        {result.type === 'User' && result.image ? (
                          <img
                            src={result.image}
                            alt={`${result.title} avatar`}
                            className="h-8 w-8 rounded-full mr-2 object-cover"
                          />
                        ) : result.type === 'User' ? (
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center mr-2">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                        ) : null}
                        <div>
                          <span className="block font-semibold">{result.title}</span>
                          <span className="block text-sm text-slate-500">{result.type}</span>
                        </div>
                      </li>
                      {index < searchResults.length - 1 && (
                        <li className="border-t border-slate-200 mx-3"></li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              )}
            </div>
            {/* <button className="ml-3 p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button> */}
            {loggedIn ? (
              <div className="ml-3 relative">
                <Dropdown
                  trigger={
                    <button className="cursor-pointer flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-100 p-1 hover:bg-slate-200 transition-colors">
                      <User className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    </button>
                  }
                >
                  {(close) => (
                    <>
                      <div className="py-1">
                        <DropdownItem
                          onClick={() => {
                            navigate(`/profile/${userId}`);
                            close();
                          }}
                          className="flex items-center cursor-pointer"
                        >
                          <UserCircle className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            navigate('/settings');
                            close();
                          }}
                          className="flex items-center cursor-pointer"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownItem>
                      </div>
                      <div className="py-1 border-t border-slate-100">
                        <DropdownItem
                          onClick={() => {
                            handleLogout();
                            close();
                          }}
                          className="flex items-center cursor-pointer"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </DropdownItem>
                      </div>
                    </>
                  )}
                </Dropdown>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="ml-3 flex items-center gap-1"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Home
          </Link>
          <div className="relative px-4 py-2">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-slate-300 rounded-md h-9"
                placeholder="Search..."
              />
              {searchResults.length > 0 && (
                <ul className="mt-2 w-full bg-white text-black rounded-md shadow-lg z-10">
                  {searchResults.map((result, index) => (
                    <React.Fragment key={result.id}>
                      <li
                        className="px-4 py-2 hover:bg-slate-100 hover:rounded-md cursor-pointer flex items-center"
                        onClick={() => handleSearchResultClick(result.id, result.type)}
                      >
                        {result.type === 'User' && result.image ? (
                          <img
                            src={result.image}
                            alt={`${result.title} avatar`}
                            className="h-8 w-8 rounded-full mr-2 object-cover"
                          />
                        ) : result.type === 'User' ? (
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center mr-2">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                        ) : null}
                        <div>
                          <span className="block font-semibold">{result.title}</span>
                          <span className="block text-sm text-slate-500">{result.type}</span>
                        </div>
                      </li>
                      {index < searchResults.length - 1 && (
                        <li className="border-t border-slate-200 mx-3"></li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="pt-4 pb-3 border-t border-slate-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-6 w-6 text-slate-500" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              to={`/profile/${userId}`}
              className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-left"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;