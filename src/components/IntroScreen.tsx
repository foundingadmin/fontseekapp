import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';

export const IntroScreen: React.FC = () => {
  const { startQuiz, skipToResults } = useQuizStore();
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'Enter') {
        skipToResults();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skipToResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      startQuiz(email);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/src/assets/Mograph-BG-C-1920x1080-optimized.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <img src="/src/assets/Founding-v1-Wordmark-white.svg" alt="FontSeek" className="w-[145px] mx-auto mb-12" />
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find your brand's perfect font in 3 minutes
          </h1>
          
          <p className="text-xl text-white/80 mb-12">
            Take our interactive quiz to discover the Google Web Font that best matches your brand's personality — with instant recommendations and usage guides.
          </p>

          <form onSubmit={handleSubmit} className="max-w-[400px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to start"
              required
              className="w-full rounded-full bg-[#0F111A] border border-[#2C2F3B] text-white px-6 py-3 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-400 text-black font-semibold px-6 py-3 text-sm hover:bg-emerald-300 transition-colors"
            >
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};