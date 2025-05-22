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
  const [voteChange,setVoteChange] = useState(true);

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

    setQuestions(data.questions);
  };

  useEffect(() => {
    try {
      if( voteChange){
        fetchQuestions();
        setVoteChange(false)
      } 
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions. Please try again later.');
    }
  }, [voteChange]);
  return (
    <div className="max-w-7xl mx-auto md:mx-48 px-2 sm:px-2 lg:px-2 py-6">
      <div className="flex flex-col md:flex-row gap-10">
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
          {questions.length > 0 && <QuestionList questions={questions} setVoteChange={setVoteChange}/>}
        </div>
      </div>
    </div>
  );
};

export default HomePage;