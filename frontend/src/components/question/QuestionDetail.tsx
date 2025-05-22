import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Check, Bookmark, Share2, Flag, ThumbsUp, ThumbsDown, MessageCircle, User, Languages, Volume2 } from 'lucide-react';
import type { Question, Answer } from '../../types';
import { Badge } from '../ui/Badge';
import { Link } from '../ui/Link';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { AnswerList } from './AnswerList';
import { AnswerForm } from './AnswerForm';
import { toast } from 'sonner';
interface QuestionDetailProps {
  question: Question;
}

interface UserData {
  name: string;
  email: string;
  occupation: string;
  bio: string;
  image?: string;
}

interface UserResponse {
  user: UserData;
}

export const QuestionDetail = ({ question }: QuestionDetailProps) => {
  console.log('QuestionDetail question:', question);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(question);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/${question.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UserResponse = await response.json();

      if (!data.user.name || !data.user.email) {
        throw new Error('Invalid user data received');
      }

      setUserData(data.user);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to fetch user data. Please try again.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleVote = (type: 'up' | 'down') => {
    // if (voteStatus === type) {
    //   setCurrentQuestion({
    //     ...currentQuestion,
    //     votes: type === 'up' ? currentQuestion.votes - 1 : currentQuestion.votes + 1
    //   });
    //   setVoteStatus(null);
    //   return;
    // }
    
    // let newVotes = currentQuestion.votes;
    // if (voteStatus === null) {
    //   newVotes = type === 'up' ? newVotes + 1 : newVotes - 1;
    // } else {
    //   newVotes = type === 'up' ? newVotes + 2 : newVotes - 2;
    // }
      
    // setCurrentQuestion({
    //   ...currentQuestion,
    //   votes: newVotes
    // });
    // setVoteStatus(type);
  };

  const handleAnswerSubmit = (answerText: string) => {
    // const newAnswer: Answer = {
    //   id: `answer-${Date.now()}`,
    //   body: answerText,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   authorId: '1',
    //   author: {
    //     id: '1',
    //     username: 'current_user',
    //     displayName: 'Current User',
    //     email: 'current.user@example.com',
    //     reputation: 123,
    //     joinedAt: new Date().toISOString(),
    //     badges: [],
    //   },
    //   questionId: question.id,
    //   votes: 0,
    //   isAccepted: false,
    //   comments: [],
    // };

    // const updatedAnswers = [...currentQuestion.answers, newAnswer];
    
    // setCurrentQuestion({
    //   ...currentQuestion,
    //   answers: updatedAnswers,
    // });
  };

  interface FormatDateOptions {
    year: 'numeric' | '2-digit';
    month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day: 'numeric' | '2-digit';
  }

  const formatDate = (dateString: string): string => {
    const options: FormatDateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-slate-50/50 p-6">
      {/* Question header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">{currentQuestion.title}</h1>
        <div className="flex flex-wrap gap-2 items-center text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Asked {formatDate(currentQuestion.createdAt)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Viewed {currentQuestion.viewsCount} times
          </span>
        </div>
      </div>

      {/* Question and answers */}
      <div className="grid grid-cols-1 gap-8">
        {/* Question */}
        <Card className="overflow-hidden shadow-lg border border-slate-200/80 hover:border-slate-300 transition-colors">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Voting */}
              <div className="md:p-6 p-4 flex md:flex-col flex-row justify-center items-center md:w-24 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200/50">
                <button 
                  className={`rounded-full transition-all ${voteStatus === 'up' ? 'bg-emerald-100 text-emerald-600 shadow-inner' : 'text-slate-400 hover:bg-slate-100 hover:text-emerald-500'}`}
                  onClick={() => handleVote('up')}
                  aria-label="Upvote"
                >
                  <ArrowUp className="h-6 w-6 text-emerald-600" />
                </button>
                <div className="flex flex-row items-center mx-3 md:flex-col md:my-3 md:mx-0">
                  {/* <span className="text-xs text-slate-500">Upvotes</span> */}
                  <span className={`text-lg font-semibold ${voteStatus === 'up' ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {currentQuestion.upvotes}
                  </span>
                  <span className="my-2 md:my-2 md:mx-0 mx-2 w-0.5 h-6 md:w-6 md:h-0.5 bg-slate-200 rounded-full"></span>
                  {/* <span className="text-xs text-slate-500 mt-2">Downvotes</span> */}
                  <span className={`text-lg font-semibold ${voteStatus === 'down' ? 'text-rose-600' : 'text-slate-700'}`}>
                    {currentQuestion.downvotes}
                  </span>
                </div>
                <button 
                  className={`rounded-full  transition-all ${voteStatus === 'down' ? 'bg-rose-100 text-rose-600 shadow-inner' : 'text-slate-400 hover:bg-slate-100 hover:text-rose-500'}`}
                  onClick={() => handleVote('down')}
                  aria-label="Downvote"
                >
                  <ArrowDown className="h-6 w-6 text-red-600" />
                </button>
                
                <div className="hidden md:flex md:flex-col items-center mt-6 space-y-3">
                    {/* Read Aloud Button */}
                    <button 
                      className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-500 transition-all"
                      aria-label="Read question aloud"
                      onClick={() => handleReadAloud()} // You'll need to implement this function
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>

                    {/* Translation Button */}
                    <button 
                      className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-500 transition-all"
                      aria-label="Translate question"
                      onClick={() => handleTranslation()} // You'll need to implement this function
                    >
                      <Languages className="h-5 w-5" />
                    </button>
                  </div>
              </div>

              {/* Question content */}
              <div className="flex-1 p-6 bg-white">
                <div className="prose max-w-none text-slate-700">
                  <p className="text-lg">{currentQuestion.description}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(currentQuestion.tags ?? []).map((tag, index) => (
                    <Badge
                        key={index}
                        variant="primary"
                        className="cursor-pointer hover:bg-indigo-200 transition-colors"
                      >
                        {tag}
                      </Badge>
                  ))}
                </div>

                {/* <div className="md:hidden flex justify-center mt-6 space-x-6">
                  <button 
                    className={`flex flex-col items-center ${isBookmarked ? 'text-amber-500' : 'text-slate-500'}`}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className="h-5 w-5" />
                    <span className="text-xs mt-1">Save</span>
                  </button>
                  <button className="flex flex-col items-center text-slate-500">
                    <Share2 className="h-5 w-5" />
                    <span className="text-xs mt-1">Share</span>
                  </button>
                  <button className="flex flex-col items-center text-slate-500">
                    <Flag className="h-5 w-5" />
                    <span className="text-xs mt-1">Report</span>
                  </button>
                </div> */}

                <div className="mt-6 pt-4 border-t border-slate-200/50 flex justify-between items-center flex-wrap gap-4">
                  {/* <div className="flex space-x-4">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>Add comment</span>
                    </button>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Follow</span>
                    </button>
                  </div> */}
                  
                  <div className="flex items-center bg-slate-50/80 p-3 rounded-lg border border-slate-200/50 hover:border-indigo-100 transition-colors ml-auto">
                    <div className="flex-shrink-0">
                      {currentQuestion.user_id ? (
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={userData?.image} 
                          alt={'User Avatar'}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          {userData?.name}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <Link to={`/profile/${question.user_id}`} className="text-sm font-medium text-slate-700 hover:text-indigo-600">
                        {userData?.name}
                      </Link>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-amber-400 rounded-full"></span>
                        Reputation
                      </p>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer count */}
        {/* <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-indigo-500 hover:border-indigo-600 transition-colors">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-indigo-500" />
            {currentQuestion.answers.length} {currentQuestion.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div> */}

        {/* Answers */}
        {/* <AnswerList answers={currentQuestion.answers} /> */}

        {/* Answer form */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-indigo-500" />
            Your Answer
          </h3>
          <AnswerForm onSubmit={handleAnswerSubmit} />
          <div className="mt-4 text-xs text-slate-500 bg-slate-50/50 p-3 rounded border border-slate-200">
            <p>Tips: Be clear and specific in your answer. Use examples if possible. Make sure to address all parts of the question.</p>
          </div>
        </div>
      </div>
    </div>
  );
};