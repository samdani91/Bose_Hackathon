import React, { useEffect, useState } from 'react';
import { QuestionDetail } from '../components/question/QuestionDetail';
import { questions } from '../data/mockData';
import type { Question } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { Link } from '../components/ui/Link';

interface QuestionPageProps {
  id: string;
}

export const QuestionPage: React.FC<QuestionPageProps> = ({ id }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchQuestion = () => {
      setLoading(true);
      setTimeout(() => {
        const foundQuestion = questions.find(q => q.id === id);
        if (foundQuestion) {
          // Update view count in a real app
          setQuestion({
            ...foundQuestion,
            views: foundQuestion.views + 1
          });
        }
        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchQuestion();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="h-40 bg-slate-200 rounded mb-6"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Question Not Found</h1>
        <p className="text-slate-600 mb-6">The question you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
        </Link>
      </div>

      <QuestionDetail question={question} />
    </div>
  );
};