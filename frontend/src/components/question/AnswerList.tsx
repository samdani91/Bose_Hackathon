import type { Answer } from '../../types';
import React from 'react';
import { AnswerCard } from './AnswerCard';

interface AnswerListProps {
  answers: Answer[];
  setIsUpvoted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AnswerList: React.FC<AnswerListProps> = ({ answers, setIsUpvoted }) => {
  return (
    <div className="space-y-6">
      {answers.map((answer) => {
        return (
          <AnswerCard answer={answer} key={answer.id} setIsUpvoted={setIsUpvoted} />
        );
      })}
    </div>
  );
};