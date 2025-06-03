import React, { useEffect } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { QuizProgress } from './components/QuizProgress';
import { InfoPopup } from './components/InfoPopup';
import { useQuizStore } from './store/quizStore';

function App() {
  const { currentQuestion, answers, skipToResults, hasStarted } = useQuizStore();
  const isComplete = Object.keys(answers).length === 10;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'Enter') {
        skipToResults();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skipToResults]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black text-white overflow-x-hidden">
      <InfoPopup />
      <main className="min-h-screen">
        {!hasStarted ? (
          <IntroScreen />
        ) : (
          <div className="pt-24 pb-16">
            <div className="container mx-auto px-4">
              {!isComplete && <QuizProgress />}
              {isComplete ? <QuizResults /> : <QuizQuestion />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;