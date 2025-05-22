import React, { useState, useEffect } from 'react';
import { QuestionCard } from './QuestionCard';
import type { Question } from '../../types';
import { Search } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  setVoteChange: React.Dispatch<React.SetStateAction<boolean>>;

}

export const QuestionList: React.FC<QuestionListProps> = ({ questions: initialQuestions , setVoteChange}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = initialQuestions.filter(
        (q) =>
          q.title.trim().toLowerCase().includes(searchQuery.toLowerCase()) ||
          (q.description && q.description.trim().toLowerCase().includes(searchQuery.toLowerCase())) ||
          q.tags.some((tag) => tag.trim().toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setQuestions(filtered);
    } else {
      setQuestions(initialQuestions);
    }
  }, [searchQuery, initialQuestions]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <form className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search questions by title, content or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

        </div>
      </div>

      <div>
        {questions.length > 0 ? (
          questions.map((question) => <QuestionCard key={question._id} question={question} setVoteChange={setVoteChange}/>)
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">No questions found</h3>
            <p className="mt-1 text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};