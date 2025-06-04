import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { quizQuestions } from '../data/quiz';
import { ArrowDown, ArrowUp, Check } from 'lucide-react';
import clsx from 'clsx';

export const QuizQuestion: React.FC = () => {
  const { currentQuestion, answers, setAnswer } = useQuizStore();
  const question = quizQuestions[currentQuestion - 1];
  const currentAnswer = answers[currentQuestion];
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (value: 'A' | 'B') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedAnswer(value);
    
    setTimeout(() => {
      setAnswer(currentQuestion, value);
      setSelectedAnswer(null);
      setIsTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        if (!currentAnswer && !selectedAnswer && !isTransitioning) {
          handleSelect(e.key === 'ArrowUp' ? 'A' : 'B');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentAnswer, selectedAnswer, isTransitioning]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-[120px] flex items-center justify-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-white text-center max-w-[600px]">
          {question.question}
        </h2>
      </div>
      
      <div className="flex flex-col gap-4 items-center">
        {[
          { value: 'A', label: question.optionA },
          { value: 'B', label: question.optionB }
        ].map((option) => {
          const isSelected = selectedAnswer === option.value;
          return (
            <button
              key={option.value}
              onClick={() => !selectedAnswer && !isTransitioning && handleSelect(option.value as 'A' | 'B')}
              disabled={selectedAnswer !== null || isTransitioning}
              className={clsx(
                'min-h-[88px] w-full max-w-[600px] p-6 rounded-xl border-2 transition-all duration-400 ease-in-out',
                'text-left text-lg font-medium group flex items-center',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75',
                isSelected
                  ? 'bg-emerald-500/10 text-white border-emerald-500 scale-[1.02]'
                  : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40',
                selectedAnswer && !isSelected && 'opacity-50'
              )}
            >
              <div className="flex items-center gap-4 w-full">
                <div
                  className={clsx(
                    'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-400 ease-in-out',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-white group-hover:border-white/60'
                  )}
                >
                  {isSelected && (
                    <Check className="w-4 h-4 text-black" />
                  )}
                </div>
                <span className="flex-1">{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center text-sm text-white/60">
        <p className="md:hidden">Tap an option to select your answer</p>
        <p className="hidden md:block">
          Click or use <span className="inline-flex items-center mx-1"><ArrowUp className="w-4 h-4" /></span> 
          and <span className="inline-flex items-center mx-1"><ArrowDown className="w-4 h-4" /></span> 
          arrow keys to select your answer
        </p>
      </div>
    </div>
  );
};