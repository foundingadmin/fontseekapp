import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { QuizProgress } from './components/QuizProgress';
import { useQuizStore } from './store/quizStore';

function App() {
  const { currentQuestion, answers, skipToResults } = useQuizStore();
  const isComplete = Object.keys(answers).length === 10;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + Option/Alt + Enter
      if (e.ctrlKey && e.altKey && e.key === 'Enter') {
        skipToResults();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skipToResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {!isComplete && <QuizProgress />}
          {isComplete ? <QuizResults /> : <QuizQuestion />}
        </div>
      </main>
    </div>
  );
}