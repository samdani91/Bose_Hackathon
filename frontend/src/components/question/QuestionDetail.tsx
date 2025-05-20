import { useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Check, Bookmark, Share2, Flag, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Question, Answer } from '../../types';
import { Badge } from '../ui/Badge';
import { Link } from '../ui/Link';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { AnswerList } from './AnswerList';
import { AnswerForm } from './AnswerForm';

interface QuestionDetailProps {
  question: Question;
}

export const QuestionDetail = ({ question }: QuestionDetailProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(question);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleVote = (type: 'up' | 'down') => {
    const newVotes = type === 'up' 
      ? currentQuestion.votes + 1 
      : currentQuestion.votes - 1;
      
    setCurrentQuestion({
      ...currentQuestion,
      votes: newVotes
    });
  };

  const handleAnswerSubmit = (answerText: string) => {
    // In a real app, this would be an API call
    const newAnswer: Answer = {
      id: `answer-${Date.now()}`,
      body: answerText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: '1', // Assuming current user
      author: {
        id: '1',
        username: 'current_user',
        displayName: 'Current User',
        email: 'current.user@example.com',
        reputation: 123,
        joinedAt: new Date().toISOString(),
        badges: [],
      },
      questionId: question.id,
      votes: 0,
      isAccepted: false,
      comments: [],
    };

    const updatedAnswers = [...currentQuestion.answers, newAnswer];
    
    setCurrentQuestion({
      ...currentQuestion,
      answers: updatedAnswers,
    });
  };

  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentQuestion.title}</h1>
        <div className="flex flex-wrap gap-2 items-center text-sm text-slate-500">
          <span>Asked {new Date(currentQuestion.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>Viewed {currentQuestion.views} times</span>
        </div>
      </div>

      {/* Question and answers */}
      <div className="grid grid-cols-1 gap-6">
        {/* Question */}
        <Card>
          <CardContent className="p-0">
            <div className="flex">
              {/* Voting */}
              <div className="p-6 flex flex-col items-center w-16 md:w-20">
                <button 
                  className="text-slate-400 hover:text-indigo-500 focus:outline-none transition-colors"
                  onClick={() => handleVote('up')}
                >
                  <ArrowUp className="h-8 w-8" />
                </button>
                <span className="text-xl font-medium text-slate-700 my-2">{currentQuestion.votes}</span>
                <button 
                  className="text-slate-400 hover:text-slate-500 focus:outline-none transition-colors"
                  onClick={() => handleVote('down')}
                >
                  <ArrowDown className="h-8 w-8" />
                </button>
                <button 
                  className={`mt-4 text-slate-400 hover:text-amber-500 focus:outline-none transition-colors ${isBookmarked ? 'text-amber-500' : ''}`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className="h-5 w-5" />
                </button>
                <button className="mt-2 text-slate-400 hover:text-slate-500 focus:outline-none transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="mt-2 text-slate-400 hover:text-rose-500 focus:outline-none transition-colors">
                  <Flag className="h-5 w-5" />
                </button>
              </div>

              {/* Question content */}
              <div className="flex-1 p-6 border-l border-slate-100">
                <div className="prose max-w-none text-slate-700">
                  <p>{currentQuestion.body}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {currentQuestion.tags.map((tag, index) => (
                    <Badge key={index} variant="primary" className="cursor-pointer hover:bg-indigo-200 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-2 text-sm">
                    <button className="text-slate-500 hover:text-indigo-600">Edit</button>
                    <button className="text-slate-500 hover:text-indigo-600">Follow</button>
                  </div>
                  <div className="flex items-center bg-slate-50 p-3 rounded-lg">
                    <div className="flex-shrink-0">
                      {currentQuestion.author.avatarUrl ? (
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={currentQuestion.author.avatarUrl} 
                          alt={currentQuestion.author.displayName} 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          {currentQuestion.author.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <Link to={`/user/${currentQuestion.author.id}`} className="text-sm font-medium text-slate-700 hover:text-indigo-600">
                        {currentQuestion.author.displayName}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {currentQuestion.author.reputation.toLocaleString()} reputation
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments would go here */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700">Comments</h3>
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">Add a comment</button>
                  </div>
                  {/* Comment list would go here */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer count */}
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-xl font-bold text-slate-900">
            {currentQuestion.answers.length} {currentQuestion.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        {/* Answers */}
        <AnswerList answers={currentQuestion.answers} />

        {/* Answer form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Your Answer</h3>
          <AnswerForm onSubmit={handleAnswerSubmit} />
        </div>
      </div>
    </div>
  );
};