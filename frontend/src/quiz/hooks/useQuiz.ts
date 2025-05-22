import { useState, useEffect } from 'react';
import type { QuizQuestion } from '../types/quiz';
import { useStreak } from './useStreak';

export const useQuiz = (questions: QuizQuestion[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const { currentStreak, highestStreak, incrementStreak, resetStreak } = useStreak();

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      incrementStreak();
    } else {
      resetStreak();
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  return {
    currentQuestion,
    selectedOption,
    isAnswered,
    score,
    currentStreak,
    highestStreak,
    handleAnswer,
    nextQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
  };
};