import { ArrowUp, ArrowDown, Check } from 'lucide-react';
import type { Answer } from '../../types';
import { Link } from '../ui/Link';
import { Card, CardContent } from '../ui/Card';
import { useState } from 'react';


interface UserData {
  name: string;
  email: string;
  occupation: string;
  bio: string;
  image?: string;
}


interface AnswerListProps {
  answers: Answer[];
  user: UserData | null;
}

export const AnswerList = ({ answers, user }: AnswerListProps) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

  function handleVote(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="space-y-6">
      {answers.map(answer => (
        <Card key={answer.id} className='border-2 border-emerald-300'>
          <CardContent className="p-0">
            <div className="flex">
              {/* Voting */}
              <div className="p-6 flex flex-col items-center w-16 md:w-20">
                <button
                  className={`rounded-full transition-all ${voteStatus === 'up' ? 'bg-emerald-100 text-emerald-600 shadow-inner' : 'text-slate-400 hover:bg-slate-100 hover:text-emerald-500'}`}
                  onClick={() => handleVote('up')}
                  aria-label="Upvote"
                >
                  <ArrowUp className="h-6 w-6" />
                </button>
                <div className="flex flex-row items-center mx-3 md:flex-col md:my-3 md:mx-0">
                  {/* <span className="text-xs text-slate-500">Upvotes</span> */}
                  <span className={`text-lg font-semibold ${voteStatus === 'up' ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {answer.upvoteCount || 0}
                  </span>
                  <span className="my-2 md:my-2 md:mx-0 mx-2 w-0.5 h-6 md:w-6 md:h-0.5 bg-slate-200 rounded-full"></span>
                  {/* <span className="text-xs text-slate-500 mt-2">Downvotes</span> */}
                  <span className={`text-lg font-semibold ${voteStatus === 'down' ? 'text-rose-600' : 'text-slate-700'}`}>
                    {answer.downvoteCount || 0}
                  </span>
                </div>
                <button
                  className={`rounded-full  transition-all ${voteStatus === 'down' ? 'bg-rose-100 text-rose-600 shadow-inner' : 'text-slate-400 hover:bg-slate-100 hover:text-rose-500'}`}
                  onClick={() => handleVote('down')}
                  aria-label="Downvote"
                >
                  <ArrowDown className="h-6 w-6" />
                </button>
                <div className="mt-4 bg-emerald-100 p-1 rounded-full">
                  <Check className="h-6 w-6 text-emerald-600" />
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
                          src={user?.image}
                          alt={user?.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          {user?.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <Link to={`/profile/${answer.userId}`} className="text-slate-700 hover:text-indigo-600">
                        {user?.name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        Answered {new Date(answer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                {/* <div className="mt-4 pt-4 border-t border-slate-200">
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
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};