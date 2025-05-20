import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface AnswerFormProps {
  onSubmit: (answerText: string) => void;
}

export const AnswerForm = ({ onSubmit }: AnswerFormProps) => {
  const [answerText, setAnswerText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerText.trim()) {
      onSubmit(answerText);
      setAnswerText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[200px]"
        placeholder="Write your answer here..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        required
      />
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-slate-500">
          Be specific and imagine you're explaining to a fellow student
        </div>
        <Button type="submit" disabled={!answerText.trim()}>
          Post Your Answer
        </Button>
      </div>
    </form>
  );
};