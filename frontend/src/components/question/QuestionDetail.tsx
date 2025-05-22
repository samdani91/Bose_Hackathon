import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Check, Bookmark, Share2, Flag, ThumbsUp, ThumbsDown, MessageCircle, User, Languages, Volume2, X, Trash2 } from 'lucide-react';
import type { Question, Answer } from '../../types';
import { Badge } from '../ui/Badge';
import { Link } from '../ui/Link';
import { Card, CardContent } from '../ui/Card';
import { AnswerList } from './AnswerList';
import { AnswerForm } from './AnswerForm';
import { toast } from 'sonner';

interface QuestionDetailProps {
  question: Question;
  setVoteChange: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserData {
  name: string;
  email: string;
  occupation: string;
  bio: string;
  image?: string;
}

interface UserResponse {
  user: UserData;
}

interface BanglaQuestion {
  title: string;
  body: string;
}

interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

// New DeleteConfirmationModal component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">Confirm Delete</h2>
        <p className="text-slate-600 mb-6">Are you sure you want to delete this question? This action cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageModal = ({ src, onClose }: ImageModalProps) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-2 rounded-lg max-w-5xl max-h-[100vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          onClick={onClose}
          aria-label="Close image"
        >
          <X className="h-5 w-5" />
        </button>
        <img src={src} alt="Enlarged view" className="max-w-full max-h-[85vh] object-contain" />
      </div>
    </div>
  );
};

export const QuestionDetail = ({ question, setVoteChange }: QuestionDetailProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(question);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [questionInBangla, setQuestionInBangla] = useState<BanglaQuestion>({
    title: '',
    body: '',
  });
  const [isTranslated, setIsTranslated] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete modal

  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/${question.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UserResponse = await response.json();

      if (!data.user.name || !data.user.email) {
        throw new Error('Invalid user data received');
      }

      setUserData(data.user);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to fetch user data. Please try again.');
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/answer/${question._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnswers(data.answers);
      console.log('Fetched answers:', data.answers);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleTranslate = async () => {
    try {
      if (!currentQuestion.title || !currentQuestion.description) {
        throw new Error('Title and description are required.');
      }

      console.log('Sending translation request:', {
        question: { title: currentQuestion.title, body: currentQuestion.description },
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/system/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          question: { title: currentQuestion.title, body: currentQuestion.description },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown'}`
        );
      }

      const data = await response.json();
      console.log('Translation response:', data);

      if (!data.translation?.question) {
        throw new Error('Invalid translation response: missing question data.');
      }

      setQuestionInBangla(data.translation.question);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to translate question. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/delete/${question._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `${errorData.message || 'Unknown'}`
        );
      }

      toast.success('Question deleted successfully!');
      setIsDeleteModalOpen(false);

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete question. Please try again.');
    }
  };

  useEffect(() => {
    if (isTranslated) {
      handleTranslate();
    } else {
      setQuestionInBangla({ title: '', body: '' });
    }
  }, [isTranslated]);

  useEffect(() => {
    fetchUser();
    if (!isLoading || isUpvoted) {
      fetchAnswers();
      setIsUpvoted(false);
    }
  }, [isLoading, isUpvoted]);

  const handleUpvote = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          question_id: question._id,
          answer_id: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upvote question');
      }
      setVoteChange(true);
    } catch (error) {
      console.error('Upvote error:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to upvote question');
      } else {
        toast.error('Failed to upvote question');
      }
    }
  };

  const handleDownvote = async () => {
    try {
      const payload = {
        question_id: question._id,
        answer_id: null,
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vote/down`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setVoteChange(true);
    } catch (error) {
      console.error('Full error:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to downvote question');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleAnswerSubmit = async (answerText: string) => {
    try {
      setIsLoading(true);
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/answer/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: answerText, questionId: currentQuestion._id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          toast.success('Answer submitted successfully!');
          setIsLoading(false);
        })
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer. Please try again.');
      setIsLoading(false);
    }
  };

  interface FormatDateOptions {
    year: 'numeric' | '2-digit';
    month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day: 'numeric' | '2-digit';
  }

  const formatDate = (dateString: string): string => {
    const options: FormatDateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  function handleReadAloud(): void {
    if ('speechSynthesis' in window) {
      const textToSpeak = isTranslated ? `${questionInBangla.title}. ${questionInBangla.body}` : `${currentQuestion.title}. ${currentQuestion.description}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isTranslated ? 'bn-BD' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-slate-50/50 p-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">{(isTranslated ? questionInBangla.title: currentQuestion.title)}</h1>
        <div className="flex flex-wrap gap-2 items-center text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Asked {formatDate(currentQuestion.createdAt)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Viewed {Math.floor(currentQuestion.viewsCount)} times
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="overflow-hidden shadow-lg border border-slate-200/80 hover:border-slate-300 transition-colors">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:p-6 p-4 flex md:flex-col flex-row justify-center items-center md:w-24 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200/50">
                <button
                  className={`rounded-full transition-all 'text-slate-400 hover:bg-slate-100 hover:text-emerald-500'`}
                  onClick={() => handleUpvote()}
                  aria-label="Upvote"
                >
                  <ArrowUp className="h-6 w-6 text-emerald-600" />
                </button>
                <div className="flex flex-row items-center mx-3 md:flex-col md:my-3 md:mx-0">
                  <span className={`text-lg font-semibold 'text-slate-700'`}>
                    {currentQuestion.upvotes}
                  </span>
                  <span className="my-2 md:my-2 md:mx-0 mx-2 w-0.5 h-6 md:w-6 md:h-0.5 bg-slate-200 rounded-full"></span>
                  <span className={`text-lg font-semibold 'text-slate-700'`}>
                    {currentQuestion.downvotes}
                  </span>
                </div>
                <button
                  className={`rounded-full transition-all 'text-slate-400 hover:bg-slate-100 hover:text-rose-500'`}
                  onClick={() => handleDownvote()}
                  aria-label="Downvote"
                >
                  <ArrowDown className="h-6 w-6 text-red-600" />
                </button>

                <div className="hidden md:flex md:flex-col items-center mt-6 space-y-3">
                  <button
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-500 transition-all"
                    aria-label="Read question aloud"
                    onClick={() => handleReadAloud()}
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-500 transition-all"
                    aria-label="Translate question"
                    onClick={() => setIsTranslated((prev) => !prev)}
                  >
                    <Languages className="h-5 w-5" />
                  </button>
                  <button
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all"
                    aria-label="Delete question"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 bg-white">
                <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                  <p className="text-lg">{(isTranslated ? questionInBangla.body : currentQuestion.description)}</p>
                </div>
                {currentQuestion.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {currentQuestion.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-md overflow-hidden border border-slate-200 cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {(currentQuestion.tags ?? []).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="primary"
                      className="cursor-pointer hover:bg-indigo-200 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="col-span-1 flex flex-col items-end text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {userData?.image ? (
                        <img
                          className="h-6 w-6 rounded-full"
                          src={userData?.image}
                          alt={userData?.name}
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          {userData?.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <div className="ml-2">
                        <Link to={`/profile/${question.user_id}`} className="text-slate-700 hover:text-indigo-600">
                          {userData?.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-indigo-500 hover:border-indigo-600 transition-colors">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-indigo-500" />
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        <AnswerList answers={answers} setIsUpvoted={setIsUpvoted} />

        <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-indigo-500" />
            Your Answer
          </h3>
          <AnswerForm onSubmit={handleAnswerSubmit} />
          <div className="mt-4 text-xs text-slate-500 bg-slate-50/50 p-3 rounded border border-slate-200">
            <p>Tips: Be clear and specific in your answer. Use examples if possible. Make sure to address all parts of the question.</p>
          </div>
        </div>
      </div>

      <ImageModal src={selectedImage} onClose={handleCloseModal} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};