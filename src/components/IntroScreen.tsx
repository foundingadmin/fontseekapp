import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';

export const IntroScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const { startQuiz, skipToResults } = useQuizStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      startQuiz(email);
    }
  };

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
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/src/assets/Mograph-BG-C-1920x1080-optimized.gif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: '0.2'
      }}
    >
      <div className="absolute inset-0 bg-black backdrop-blur-sm" />
      
      <div className="relative z-10 max-w-xl mx-auto px-4 py-16 text-center">
        <img src="/src/assets/Founding-v1-Wordmark-white.svg" alt="FontSeek" className="h-8 mx-auto mb-12" />
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Find your brand's perfect font in 3 minutes
        </h1>
        
        <p className="text-xl text-white/80 mb-12">
          Take our interactive quiz to discover the Google Web Font that best matches your brand's personality — with instant recommendations and usage guides.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to start"
            className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
            required
          />
          
          <button
            type="submit"
            className="w-full px-6 py-4 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
          >
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
};