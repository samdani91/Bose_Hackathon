import React, { useEffect, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { QuestionList } from '../components/questions/QuestionList';
import type { Tag, Question } from '@/types';
import { toast } from 'sonner';

interface ApiTagsResponse {
  message: string;
  tags: Tag[];
}

interface ApiQuestionsResponse {
  questions: Question[];
}

export const TagPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [voteChange, setVoteChange] = useState<boolean>(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoadingTags(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/system/getTags`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiTagsResponse = await response.json();
        const sortedTags = data.tags.sort((a, b) => b.count - a.count);
        setTags(sortedTags);
        if (sortedTags.length > 0) {
          setSelectedTag(sortedTags[0].name);
          setVoteChange(true);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load tags');
        console.error('Error fetching tags:', err);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedTag) return;
      try {
        setLoadingQuestions(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/tag`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ tags: [selectedTag] }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiQuestionsResponse = await response.json();
        setQuestions(data.questions);
        setError(null);
      } catch (err) {
        setError('Failed to load questions for this tag');
        console.error('Error fetching questions:', err);
        toast.error('Failed to load questions. Please try again later.');
      } finally {
        setLoadingQuestions(false);
      }
    };

    if (voteChange) {
      fetchQuestions();
      setVoteChange(false);
    }
  }, [selectedTag, voteChange]);

  return (
    <div className='min-h-screen'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">All Tags</h1>
          {loadingTags ? (
            <div>Loading tags...</div>
          ) : error && !tags.length ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.map(tag => (
                <button
                  key={tag._id}
                  className={`transition-colors ${selectedTag === tag.name ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-100 hover:bg-indigo-200'} rounded-full px-3 py-1`}
                  onClick={() => {
                    setSelectedTag(tag.name === selectedTag ? null : tag.name);
                    setVoteChange(true);
                  }}
                >
                  <Badge variant="primary" className={`inline-block ${selectedTag === tag.name ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-100 hover:bg-indigo-200'}`}>
                    {tag.name} <span className={`ml-1 ${selectedTag === tag.name ? ' text-white ' : 'text-indigo-600'}`}>×{tag.count}</span>
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            {selectedTag ? `Questions tagged [${selectedTag}]` : 'Select a tag to view questions'}
          </h2>
          {loadingQuestions ? (
            <div>Loading questions...</div>
          ) : error && !questions.length && selectedTag ? (
            <div className="text-red-600">{error}</div>
          ) : questions.length > 0 ? (
            <QuestionList questions={questions} setVoteChange={setVoteChange} />
          ) : selectedTag ? (
            <div>No questions found for this tag.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TagPage;