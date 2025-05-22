import React, { useEffect, useState } from 'react';
import { QuestionList } from '../components/questions/QuestionList';
import { SidebarNav } from '../components/homepage/SidebarNav';
import { PopularTags } from '../components/homepage/PopularTags';
import { TopUsers } from '../components/homepage/TopUsers';
import { AskQuestionButton } from '../components/questions/AskQuestionButton';
import { tags, users } from '../data/mockData';
import type { Question } from '@/types';
import { toast } from 'sonner';

export const HomePage: React.FC = () => {

  const [questions, setQuestions] = useState<Question[]>([]);

  const fetchQuestions = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      toast.error('Failed to fetch questions');
      return;
    }
    const data = await response.json();
    // console.log('Fetched questions:', data.questions);
    // const newQuestions = (Array.isArray(data.questions) ? data.questions : []).map(q => ({
    //   id: q._id,
    //   title: q.title,
    //   body: q.description,
    //   tags: q.tags || [],
    //   createdAt: q.createdAt,
    //   updatedAt: q.updatedAt,
    //   authorId: q.user_id,
    //   author: { id: q.user_id, email: 'Unknown' }, // Backend doesn't provide email
    //   votes: (q.upvotes || 0) - (q.downvotes || 0),
    //   answers: [], // Backend doesn't provide answers
    //   views: q.viewsCount || 0,
    //   isResolved: false, // Backend doesn't provide isResolved
    // }));
    setQuestions(data.questions);
  };

  useEffect(() => {
    try {
      fetchQuestions();
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions. Please try again later.');
    }
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <SidebarNav />
            <div className="mt-8">
              <PopularTags tags={tags} />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Top Questions</h1>
            <AskQuestionButton />
          </div>
          {questions.length > 0 && <QuestionList questions={questions}/>}
        </div>

        {/* Right sidebar */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="sticky top-20">
            <TopUsers users={users} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;