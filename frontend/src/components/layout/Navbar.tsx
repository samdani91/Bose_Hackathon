import React, { useState, useEffect } from 'react';
import { Search, Menu, X, MessageCircle, Bell, User, Settings, UserCircle, LogIn, LogOut } from 'lucide-react';
import { Link } from '../ui/Link';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("isAuthenticatedToFactRush") === "true");

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
              <Link to="/" className="border-indigo-500 text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              {/* <Link to="/tags" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Tags
              </Link>
              <Link to="/users" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Users
              </Link> */}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex items-center">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-slate-300 rounded-md h-9"
                placeholder="Search..."
              />
            </div>
            <button className="ml-3 p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>
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
                            navigate('/profile');
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
          <Link to="/" className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Home
          </Link>
          <Link to="/tags" className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Tags
          </Link>
          <Link to="/users" className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Users
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-slate-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-6 w-6 text-slate-500" aria-hidden="true" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-slate-800">Guest User</div>
              <div className="text-sm font-medium text-slate-500">guest@example.com</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link to="/profile" className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100">
              Your Profile
            </Link>
            <Link to="/settings" className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100">
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