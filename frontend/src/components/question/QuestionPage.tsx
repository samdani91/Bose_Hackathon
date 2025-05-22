import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QuestionDetail } from './QuestionDetail';
import type { Question } from '../../types';

const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteChange, setVoteChange] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/${id}`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }
        const data = await response.json();
        console.log('Response for q by id:', data);
        setQuestion(data.question);


      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if(voteChange){
      fetchQuestion();
      setVoteChange(false);
    }
  }, [id, voteChange]);

  if (loading) {
    return <div className="p-8 text-center">Loading question...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!question) {
    return <div className="p-8 text-center">Question not found</div>;
  }

  return <QuestionDetail question={question} setVoteChange={setVoteChange} />;
};

export default QuestionPage;