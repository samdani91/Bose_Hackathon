import type { QuizQuestion } from '../types/quiz';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedOption: number) => void;
  disabled?: boolean;
  selectedOption?: number | null;
}

export const QuizCard = ({ 
  question, 
  onAnswer, 
  disabled = false,
  selectedOption = null 
}: QuizCardProps) => {
  // Convert options to array format if they come as object
  const optionsArray = Array.isArray(question.options)
    ? question.options
    : Object.values(question.options);

  // Get correct answer index
  const getCorrectAnswerIndex = (): number => {
    if (typeof question.correctAnswer === 'number') {
      return question.correctAnswer;
    }
    // Handle both letter (A/B/C) and key ('A'/'B'/'C')
    const answer = question.correctAnswer.toUpperCase();
    return answer.charCodeAt(0) - 65; // A=0, B=1, etc.
  };

  const correctIndex = getCorrectAnswerIndex();

  const getButtonClass = (index: number) => {
    let classes = 'w-full px-4 py-3 text-left border rounded-lg transition-colors ';

    if (disabled) {
      classes += 'opacity-70 cursor-not-allowed ';
      
      if (index === correctIndex) {
        classes += 'bg-green-50 border-green-300 text-green-700 ';
      } else if (index === selectedOption) {
        classes += 'bg-red-50 border-red-300 text-red-700 ';
      } else {
        classes += 'border-gray-300 text-gray-500 ';
      }
    } else {
      classes += 'hover:bg-indigo-50 hover:border-indigo-300 active:bg-indigo-100 border-gray-300 text-gray-700 ';
    }

    return classes;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="mb-4 text-xl font-medium text-gray-800">
          Quiz Question
        </div>
        <p className="mt-2 text-gray-700 text-lg">{question.question}</p>
        
        <div className="mt-6 space-y-3">
          {optionsArray.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              disabled={disabled}
              className={getButtonClass(index)}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span> 
              {String(option)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};