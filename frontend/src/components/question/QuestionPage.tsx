import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QuestionDetail } from './QuestionDetail';
import type { Question } from '../../types';
import { questions } from '@/data/mockData';

const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        
        // For development: Use mock data
        if (import.meta.env.DEV) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockQuestion = questions.find(q => q.id === id);
          if (mockQuestion) {
            setQuestion(mockQuestion);
          } else {
            throw new Error('Question not found');
          }
        } else {
          // For production: Call the real API
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/${id}`);

          if (!response.ok) {
            throw new Error('Failed to fetch question');
          }


        const data = await response.json();
          setQuestion(data);
        }



      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading question...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!question) {
    return <div className="p-8 text-center">Question not found</div>;
  }

  return <QuestionDetail question={question} />;
};

export default QuestionPage;