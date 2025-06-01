import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { useQuizStore } from '../store/quizStore';
import { quizQuestions } from '../data/quiz';

export const QuizProgress: React.FC = () => {
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const progress = (currentQuestion / quizQuestions.length) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <Progress.Root 
        className="relative overflow-hidden bg-white/20 rounded-full w-full h-2"
        value={progress}
      >
        <Progress.Indicator
          className="bg-white w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
      <div className="mt-2 text-sm text-white/60">
        Question {currentQuestion} of {quizQuestions.length}
      </div>
    </div>
  );
};