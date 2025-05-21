import React from 'react';
import { MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';
import type { Question } from '../../types';
import { Badge } from '../ui/Badge';
import { Link } from '../ui/Link';
import { Card, CardContent } from '../ui/Card';

interface QuestionCardProps {
  question: Question;
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

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <Card className="mb-4 transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="grid grid-cols-6 w-full">
          {/* Voting and stats column - ~16.67% (1/6) */}
          <div className="col-span-1 px-2 py-2 text-center flex flex-col items-center justify-start gap-2 border-r border-slate-100">
            <div className="flex flex-col items-center">
              <button className="text-slate-400 hover:text-indigo-500 focus:outline-none transition-colors">
                <ArrowUp className="h-6 w-6" />
              </button>
              <span className="text-lg font-medium text-slate-700 my-1">{question.votes}</span>
              <button className="text-slate-400 hover:text-slate-500 focus:outline-none transition-colors">
                <ArrowDown className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center text-slate-500 text-sm mt-3">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{question.answers.length}</span>
            </div>
            <div className="text-slate-500 text-sm">
              <span>{question.views} views</span>
            </div>
          </div>

          {/* Question content - ~83.33% (5/6) */}
          <div className="col-span-5 p-6">
            <div>
              <Link
                to={`/question/${question.id}`}
                className="text-lg font-medium text-indigo-600 hover:text-indigo-800 line-clamp-2"
              >
                {question.title}
              </Link>
              <p className="mt-2 text-slate-600 line-clamp-3">{question.body}</p>
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
                    {question.author.avatarUrl ? (
                      <img
                        className="h-6 w-6 rounded-full"
                        src={question.author.avatarUrl}
                        alt={question.author.displayName}
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                        {question.author.displayName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <div className="ml-2">
                      <Link to={`/user/${question.author.id}`} className="text-slate-700 hover:text-indigo-600">
                        {question.author.displayName}
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