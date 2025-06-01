import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { quizQuestions } from '../data/quiz';
import { ArrowDown, ArrowUp, Check, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export const QuizQuestion: React.FC = () => {
  const { currentQuestion, answers, setAnswer, previousQuestion } = useQuizStore();
  const question = quizQuestions[currentQuestion - 1];
  const currentAnswer = answers[currentQuestion];
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);

  const handleSelect = (value: 'A' | 'B') => {
    setSelectedAnswer(value);
    // Reduced delay from 500ms to 300ms for faster transitions
    setTimeout(() => {
      setAnswer(currentQuestion, value);
      setSelectedAnswer(null); // Reset for next question
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        if (!currentAnswer && !selectedAnswer) {
          handleSelect(e.key === 'ArrowUp' ? 'A' : 'B');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentAnswer, selectedAnswer]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        {currentQuestion > 1 ? (
          <button
            onClick={previousQuestion}
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        ) : (
          <div></div>
        )}
      </div>
      
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">
        {question.question}
      </h2>
      
      <div className="flex flex-col gap-4">
        {[
          { value: 'A', label: question.optionA },
          { value: 'B', label: question.optionB }
        ].map((option) => {
          const isSelected = selectedAnswer === option.value;
          return (
            <button
              key={option.value}
              onClick={() => !selectedAnswer && handleSelect(option.value as 'A' | 'B')}
              disabled={selectedAnswer !== null}
              className={clsx(
                'w-full p-6 rounded-xl border-2 transition-all duration-200',
                'text-left text-lg font-medium group',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75',
                isSelected
                  ? 'bg-emerald-500/10 text-white border-emerald-500 scale-[1.02]'
                  : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40',
                selectedAnswer && !isSelected && 'opacity-50'
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={clsx(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-white group-hover:border-white/60'
                  )}
                >
                  {isSelected && (
                    <Check className="w-4 h-4 text-black" />
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            </button>
          );
        })}
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