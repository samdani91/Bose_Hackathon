import type { QuizQuestion } from '../types/quiz';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedOption: number) => void;
  disabled?: boolean;
}

export const QuizCard = ({ question, onAnswer, disabled }: QuizCardProps) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      {question.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={question.imageUrl} 
            alt="Question illustration" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          {question.category} • {question.difficulty}
        </div>
        <p className="mt-2 text-gray-700 text-lg">{question.question}</p>
        
        <div className="mt-6 space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              disabled={disabled}
              className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};