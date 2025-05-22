import { ArrowUp, ArrowDown, Check } from 'lucide-react';
import type { Answer } from '../../types';
import { Link } from '../ui/Link';
import { Card, CardContent } from '../ui/Card';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';

interface AnswerListProps {
  answers: Answer[];
  setIsUpvoted: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserData {
  name: string;
  email: string;
  occupation: string;
  bio: string;
  image?: string;
}

export const AnswerList: React.FC<AnswerListProps> = ({ answers, setIsUpvoted }) => {
  const [userMap, setUserMap] = useState<Map<string, UserData>>(new Map());

  const fetchUser = async (userId: string, answerId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User data:', data);
      if (data.user?.name && data.user?.email) {
        const userData: UserData = {
          name: data.user.name,
          email: data.user.email,
          occupation: data.user.occupation || '',
          bio: data.user.bio || '',
          image: data.user.image || '',
        };
        setUserMap((prev) => new Map(prev).set(answerId, userData));
      }
    } catch (err) {
      console.error(`Fetch user ${userId} error:`, err);
      // toast.error('Failed to fetch user data. Please try again.');
    }
  };

  // useEffect(() => {
  //   if (answers.length === 0) return;

  //   answers.forEach((answer) => {
  //     fetchUser(answer.userId, answer.id);
  //   });
  // }, [answers]);

  const handleUpvote = async (answer: Answer) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          question_id: null,
          answer_id: answer.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upvote answer');
      }
      toast.success('Upvoted successfully!');
      setIsUpvoted(true);
    } catch (error) {
      console.error('Upvote error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upvote answer');
    }
  };

  const handleDownvote = async (answer: Answer) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/down`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          question_id: null,
          answer_id: answer.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      toast.success('Downvoted successfully!');
      setIsUpvoted(true);
    } catch (error) {
      console.error('Downvote error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to downvote answer');
    }
  };

  return (
    <div className="space-y-6">
      {answers.map((answer) => {
        const user = userMap.get(answer.id);
        return (
          <Card key={answer.id} className="border-2 border-emerald-300">
            <CardContent className="p-0">
              <div className="flex">
                {/* Voting */}
                <div className="p-6 flex flex-col items-center w-16 md:w-20">
                  <button
                    className="rounded-full transition-all text-slate-400 hover:bg-slate-100 hover:text-emerald-500"
                    onClick={() => handleUpvote(answer)}
                    aria-label="Upvote"
                  >
                    <ArrowUp className="h-6 w-6 text-emerald-600" />
                  </button>
                  <div className="flex flex-row items-center mx-3 md:flex-col md:my-3 md:mx-0">
                    <span className="text-lg font-semibold text-slate-700">
                      {answer.upvoteCount || 0}
                    </span>
                    <span className="my-2 md:my-2 md:mx-0 mx-2 w-0.5 h-6 md:w-6 md:h-0.5 bg-slate-200 rounded-full"></span>
                    <span className="text-lg font-semibold text-slate-700">
                      {answer.downvoteCount || 0}
                    </span>
                  </div>
                  <button
                    className="rounded-full transition-all text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                    onClick={() => handleDownvote(answer)}
                    aria-label="Downvote"
                  >
                    <ArrowDown className="h-6 w-6 text-red-600" />
                  </button>
                  <div className="mt-4 bg-emerald-100 p-1 rounded-full">
                    {answer.upvoteCount > 50 && <Check className="h-6 w-6 text-emerald-600" />}
                  </div>
                </div>

                {/* Answer content */}
                <div className="flex-1 p-6 border-l border-slate-100">
                  <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                    <p>{answer.text}</p>
                  </div>
                  <div className="mt-6 flex justify-end items-center">
                    <div className="flex items-center bg-slate-50 p-3 rounded-lg">
                      <div className="flex-shrink-0">
                        {user?.image ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.image}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <Link to={`/profile/${answer.userId}`} className="text-slate-700 hover:text-indigo-600">
                          {user?.name || 'Unknown User'}
                        </Link>
                        <p className="text-xs text-slate-500">
                          Answered {new Date(answer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};