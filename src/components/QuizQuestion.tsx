import React, { useEffect } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useQuizStore } from '../store/quizStore';
import { quizQuestions } from '../data/quiz';
import { ArrowDown, ArrowUp, Check, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export const QuizQuestion: React.FC = () => {
  const { currentQuestion, answers, setAnswer, previousQuestion } = useQuizStore();
  const question = quizQuestions[currentQuestion - 1];
  const currentAnswer = answers[currentQuestion];

  const handleSelect = (value: string) => {
    setAnswer(currentQuestion, value as 'A' | 'B');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        if (!currentAnswer) {
          handleSelect(e.key === 'ArrowUp' ? 'A' : 'B');
        } else if (currentAnswer === 'A' && e.key === 'ArrowDown') {
          handleSelect('B');
        } else if (currentAnswer === 'B' && e.key === 'ArrowUp') {
          handleSelect('A');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentAnswer]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {currentQuestion > 1 && (
        <button
          onClick={previousQuestion}
          className="flex items-center gap-1 text-white/60 hover:text-white mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to previous question
        </button>
      )}
      
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">
        {question.question}
      </h2>
      
      <div className="flex flex-col gap-4">
        {[
          { value: 'A', label: question.optionA },
          { value: 'B', label: question.optionB }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={clsx(
              'w-full p-6 rounded-xl border-2 transition-all duration-200',
              'text-left text-lg font-medium group',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75',
              currentAnswer === option.value
                ? 'bg-emerald-500/10 text-white border-emerald-500'
                : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40'
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={clsx(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                  currentAnswer === option.value
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-white group-hover:border-white/60'
                )}
              >
                {currentAnswer === option.value && (
                  <Check className="w-4 h-4 text-black" />
                )}
              </div>
              <span>{option.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-white/60">
        <p className="md:hidden">Click an option to select your answer</p>
        <p className="hidden md:block">
          Click or use <span className="inline-flex items-center mx-1"><ArrowUp className="w-4 h-4" /></span> 
          and <span className="inline-flex items-center mx-1"><ArrowDown className="w-4 h-4" /></span> 
          arrow keys to select your answer
        </p>
      </div>
    </div>
  );
};