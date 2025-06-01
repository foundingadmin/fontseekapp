import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { useQuizStore } from '../store/quizStore';
import { quizQuestions } from '../data/quiz';

export const QuizProgress: React.FC = () => {
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const progress = (currentQuestion / quizQuestions.length) * 100;

  return (
    <div className="flex flex-col items-end">
      <Progress.Root 
        className="relative overflow-hidden bg-white/20 rounded-full w-32 h-1.5 mb-1"
        value={progress}
      >
        <Progress.Indicator
          className="bg-emerald-500 w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
      <div className="text-xs text-white/60">
        Question {currentQuestion} of {quizQuestions.length}
      </div>
    </div>
  );
};