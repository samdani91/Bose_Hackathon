import React from 'react';
import { MessageSquare, ArrowUp, ArrowDown, Check } from 'lucide-react';
import type { Question } from '../../types';
import { Badge } from '../ui/Badge';
import { Link } from '../ui/Link';
import { Card, CardContent } from '../ui/Card';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <Card className="mb-4 transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex w-full">
          {/* Voting and stats column */}
          <div className="px-4 py-6 text-center flex flex-col items-center justify-start gap-2 w-24 border-r border-slate-100">
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

          {/* Question content */}
          <div className="flex-1 p-6">
            <div>
              <Link 
                to={`/question/${question.id}`}
                className="text-lg font-medium text-indigo-600 hover:text-indigo-800 line-clamp-2"
              >
                {question.title}
              </Link>
              <p className="mt-2 text-slate-600 line-clamp-3">
                {question.body}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="primary" className="cursor-pointer hover:bg-indigo-200 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center text-sm">
                <div className="flex-shrink-0">
                  {question.author.avatarUrl ? (
                    <img 
                      className="h-8 w-8 rounded-full" 
                      src={question.author.avatarUrl} 
                      alt={question.author.displayName} 
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                      {question.author.displayName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-2">
                  <Link to={`/user/${question.author.id}`} className="text-slate-700 hover:text-indigo-600">
                    {question.author.displayName}
                  </Link>
                  <p className="text-slate-500">
                    {new Date(question.createdAt).toLocaleDateString()} at {new Date(question.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};