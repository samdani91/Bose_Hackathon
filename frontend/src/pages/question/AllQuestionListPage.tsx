import React, { useState, useEffect } from 'react';
import { QuestionCard } from '../../components/questions/QuestionCard';
import { Button } from '../../components/ui/Button';
import { ArrowUpDown, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  _id: string;
  user_id: string; // Added to match QuestionSchema and QuestionCard requirements
  title: string;
  description?: string;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  viewsCount: number; // Added to match QuestionSchema and QuestionCard requirements
}

const AllQuestionListPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [initialQuestions, setInitialQuestions] = useState<Question[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'votes' | 'activity'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setQuestions(data.questions || []);
          setInitialQuestions(data.questions || []);
        } else {
          toast.error('Failed to fetch questions');
        }
      } catch (err) {
        toast.error('Something went wrong while fetching questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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

  const handleSort = (sortType: 'newest' | 'votes' | 'activity') => {
    setSortBy(sortType);
    const sortedQuestions = [...questions];

    if (sortType === 'newest') {
      sortedQuestions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortType === 'votes') {
      sortedQuestions.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
    } else if (sortType === 'activity') {
      sortedQuestions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    setQuestions(sortedQuestions);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sortBy === 'newest' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleSort('newest')}
              >
                Newest
              </Button>
              <Button
                variant={sortBy === 'votes' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleSort('votes')}
              >
                Most Votes
              </Button>
              <Button
                variant={sortBy === 'activity' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleSort('activity')}
              >
                Recent Activity
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">Loading questions...</h3>
          </div>
        ) : questions.length > 0 ? (
          questions.map((question) => <QuestionCard key={question._id} question={question} />)
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

export default AllQuestionListPage;