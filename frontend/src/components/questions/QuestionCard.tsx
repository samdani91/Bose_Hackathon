import React, { useEffect, useState } from 'react';
import { MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import type { Question, User } from '../../types';
import { Badge } from '../ui/Badge';
import { Link } from '../ui/Link';
import { Card, CardContent } from '../ui/Card';
import { toast } from 'sonner';

interface QuestionCardProps {
  question: Question;
  setVoteChange: React.Dispatch<React.SetStateAction<boolean>>;

}

// Function to format date as relative time (e.g., "2 years ago")
const formatRelativeDate = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30.42); // Average days per month
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, setVoteChange }) => {

  const [user, setUser] = useState<User>();

  const fetchUser = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/${question.user_id}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      toast.error('Failed to fetch question creator');
      return;
    }
    const data = await response.json();
    const newUser: User = {
      id: data.user._id,
      username: data.user.name,
      email: data.user.email,
      avatarUrl: data.user.image,
      joinedAt: data.user.createdAt,
    };
    setUser(newUser);
  };


  const handleUpvote = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          question_id: question._id,
          answer_id: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upvote question');
      }

      const data = await response.json();
      question.upvotes = data.upvotes;
      toast.success('Upvoted successfully!');
      setVoteChange(true)
    } catch (error) {
      console.error('Upvote error:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to upvote question');
      } else {
        toast.error('Failed to upvote question');
      }
    }
  };


  const handleDownvote = async () => {
    try {
      // console.log('Sending downvote for question:', question._id);

      const payload = {
        question_id: question._id,
        answer_id: null,
      };

      console.log('Request payload:', payload);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/down`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success response:', data);

      question.downvotes = data.downvotes;
      toast.success('Downvoted successfully!');
      setVoteChange(true)
    } catch (error) {
      console.error('Full error:', error);

      if (error instanceof Error) {
        toast.error(error.message || 'Failed to downvote question');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <Card className="mb-4 transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="grid grid-cols-6 w-full">
          {/* Voting and stats column - ~16.67% (1/6) */}
          <div className="col-span-1 px-2 py-2 text-center flex flex-col items-center justify-start gap-2 border-r border-slate-100">
            <div className="flex flex-col items-center">
              <button className="text-slate-400 hover:text-indigo-500 focus:outline-none transition-colors" onClick={handleUpvote}>
                <ArrowUp className="h-6 w-6 text-emerald-600" />
              </button>
              <div className="flex items-center mx-3 flex-col md:my-3 md:mx-0">
                {/* <span className="text-xs text-slate-500">Upvotes</span> */}
                <span className={`text-lg font-semibold `}>
                  {question.upvotes}
                </span>
                <span className="my-2 md:my-2 md:mx-0 mx-2 w-6 h-0.5 bg-slate-200 rounded-full"></span>
                {/* <span className="text-xs text-slate-500 mt-2">Downvotes</span> */}
                <span className={`text-lg font-semibold `}>
                  {question.downvotes}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-500 focus:outline-none transition-colors" onClick={handleDownvote}>
                <ArrowDown className="h-6 w-6 text-red-600" />
              </button>
            </div>
            {/* <div className="flex items-center text-slate-500 text-sm mt-3">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{question.answers.length}</span>
            </div> */}
            <div className="text-slate-500 text-sm">
              <span>{Math.floor(question.viewsCount)} views</span>
            </div>
          </div>

          {/* Question content - ~83.33% (5/6) */}
          <div className="col-span-5 p-6">
            <div>
              <Link
                to={`/question/${question._id}`}
                className="text-lg font-medium text-indigo-600 hover:text-indigo-800 line-clamp-2"
              >
                {question.title}
              </Link>
              <p className="mt-2 text-slate-600 line-clamp-3 whitespace-pre-wrap">{question.description}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 items-center">
              <div className="flex flex-wrap col-span-2 gap-2">
                {question.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="primary"
                    className="cursor-pointer hover:bg-indigo-200 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {/* Profile data and date in bottom-right */}
              <div className="col-span-1 flex flex-col items-end text-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {user?.avatarUrl ? (
                      <img
                        className="h-6 w-6 rounded-full"
                        src={user?.avatarUrl}
                        alt={user?.username}
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                        {user?.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <div className="ml-2">
                      <Link to={`/profile/${question.user_id}`} className="text-slate-700 hover:text-indigo-600">
                        {user?.username}
                      </Link>
                    </div>
                    <div className="mt-1 ml-2 text-slate-500 text-xs">
                      {formatRelativeDate(question.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};