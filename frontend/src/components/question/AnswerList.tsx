import { ArrowUp, ArrowDown, Check, MessageSquare } from 'lucide-react';
import type { Answer } from '../../types';
import { Link } from '../ui/Link';
import { Card, CardContent } from '../ui/Card';

interface AnswerListProps {
  answers: Answer[];
}

export const AnswerList = ({ answers }: AnswerListProps) => {
  // Sort answers: accepted first, then by votes
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <div className="space-y-6">
      {sortedAnswers.map(answer => (
        <Card key={answer.id} className={answer.isAccepted ? 'border-2 border-emerald-300' : ''}>
          <CardContent className="p-0">
            <div className="flex">
              {/* Voting */}
              <div className="p-6 flex flex-col items-center w-16 md:w-20">
                <button className="text-slate-400 hover:text-indigo-500 focus:outline-none transition-colors">
                  <ArrowUp className="h-8 w-8" />
                </button>
                <span className="text-xl font-medium text-slate-700 my-2">{answer.votes}</span>
                <button className="text-slate-400 hover:text-slate-500 focus:outline-none transition-colors">
                  <ArrowDown className="h-8 w-8" />
                </button>
                {answer.isAccepted && (
                  <div className="mt-4 bg-emerald-100 p-1 rounded-full">
                    <Check className="h-6 w-6 text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Answer content */}
              <div className="flex-1 p-6 border-l border-slate-100">
                <div className="prose max-w-none text-slate-700">
                  <p>{answer.body}</p>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-2 text-sm">
                    <button className="text-slate-500 hover:text-indigo-600">Edit</button>
                    <button className="text-slate-500 hover:text-indigo-600">Share</button>
                    <button className="text-slate-500 hover:text-indigo-600">Follow</button>
                  </div>
                  <div className="flex items-center bg-slate-50 p-3 rounded-lg">
                    <div className="flex-shrink-0">
                      {answer.author.avatarUrl ? (
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={answer.author.avatarUrl} 
                          alt={answer.author.displayName} 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          {answer.author.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <Link to={`/user/${answer.author.id}`} className="text-sm font-medium text-slate-700 hover:text-indigo-600">
                        {answer.author.displayName}
                      </Link>
                      <p className="text-xs text-slate-500">
                        Answered {new Date(answer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700">
                      Comments ({answer.comments.length})
                    </h3>
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">Add a comment</button>
                  </div>
                  
                  {answer.comments.length > 0 && (
                    <div className="space-y-2">
                      {answer.comments.map(comment => (
                        <div key={comment.id} className="flex py-2 text-sm">
                          <div className="flex-1 text-slate-600">
                            {comment.body}
                            <span className="mx-2 text-slate-400">–</span>
                            <Link to={`/user/${comment.author.id}`} className="text-indigo-600 hover:text-indigo-800">
                              {comment.author.displayName}
                            </Link>
                            <span className="ml-2 text-slate-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center ml-2 space-x-2">
                            <button className="text-slate-400 hover:text-indigo-500 focus:outline-none transition-colors">
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-slate-500">{comment.votes}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};