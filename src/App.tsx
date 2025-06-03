import React, { useEffect } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { QuizProgress } from './components/QuizProgress';
import { InfoPopup } from './components/InfoPopup';
import { useQuizStore } from './store/quizStore';
import { Heart } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black text-white overflow-x-hidden relative">
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
      <div className={`py-4 ${!hasStarted ? 'absolute bottom-0 left-0 right-0' : ''}`}>
        <div className="container mx-auto px-4 flex items-center justify-center text-sm text-white/60">
          Built with <Heart className="w-4 h-4 mx-2 text-emerald-500" /> by{' '}
          <a 
            href="https://foundingcreative.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 text-white hover:text-emerald-400 transition-colors"
          >
            Founding Creative
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;