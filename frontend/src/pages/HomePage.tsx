import React from 'react';
import { QuestionList } from '../components/questions/QuestionList';
import { SidebarNav } from '../components/homepage/SidebarNav';
import { PopularTags } from '../components/homepage/PopularTags';
import { TopUsers } from '../components/homepage/TopUsers';
import { AskQuestionButton } from '../components/questions/AskQuestionButton';
import { questions, tags, users } from '../data/mockData';

export const HomePage: React.FC = () => {
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
          <QuestionList questions={questions} />
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