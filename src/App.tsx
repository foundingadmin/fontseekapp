import React, { useEffect, useState } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { QuizProgress } from './components/QuizProgress';
import { InfoPopup } from './components/InfoPopup';
import { useQuizStore } from './store/quizStore';
import { Heart } from 'lucide-react';

function App() {
  const { currentQuestion, answers, skipToResults, hasStarted } = useQuizStore();
  const [showInfoPopup, setShowInfoPopup] = useState(false);
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
    <div className="relative min-h-screen w-full text-white">
      {/* Fixed background layer */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 animate-gradient opacity-10" />
        <img 
          src="/Wave-Black.svg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-[2.5]"
          style={{ 
            mixBlendMode: 'normal',
            transform: 'scale(2.5) translateY(-10%)',
            transformOrigin: 'center'
          }}
        />
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Scrollable content layer */}
      <div className="relative z-10">
        <main className="min-h-screen pb-24">
          {!hasStarted ? (
            <IntroScreen />
          ) : (
            <div className="pt-24">
              <div className="container mx-auto px-4">
                {!isComplete && <QuizProgress />}
                {isComplete ? (
                  <QuizResults onShowInfo={() => setShowInfoPopup(true)} />
                ) : (
                  <QuizQuestion />
                )}
              </div>
            </div>
          )}
        </main>

        {/* Fixed footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-30">
          <div className="bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="container mx-auto flex items-center justify-center py-6 px-4 text-sm text-white/60">
              Designed & Built with <Heart className="w-4 h-4 mx-2 text-emerald-500" /> by{' '}
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
        </footer>
      </div>

      {/* Info Popup */}
      {showInfoPopup && <InfoPopup onClose={() => setShowInfoPopup(false)} />}
    </div>
  );
}

export default App;