import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';
import wordmarkLogo from '../assets/Founding-v1-Wordmark-white.svg';
import { Heart } from 'lucide-react';

export const IntroScreen: React.FC = () => {
  const { startQuiz } = useQuizStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        startQuiz('test@fontseek.com');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startQuiz]);

  const submitToHubSpot = async (email: string) => {
    const portalId = '242336861';
    const formGuid = '5d375dfe-3d01-4816-9192-93063d111929';
    
    const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: [
          {
            name: 'email',
            value: email
          },
          {
            name: 'lead_source',
            value: 'FontSeek Quiz'
          }
        ],
        context: {
          pageUri: window.location.href,
          pageName: document.title
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit to HubSpot');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitToHubSpot(email);
      startQuiz(email);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 animate-gradient opacity-10" />
      <img 
        src="/Wave-Black.svg" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        style={{ mixBlendMode: 'normal' }}
      />
      
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10" />
      
      <div className="relative z-20 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <a href="/" className="inline-block mb-12">
              <img 
                src={wordmarkLogo}
                alt="FontSeek - Strategy-Driven Font Recommendations" 
                className="w-[140px] h-auto"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  console.error('Failed to load image:', img.src);
                }}
              />
            </a>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose fonts on what they say. Not how they look.
            </h1>
            
            <p className="text-xl text-white/80 mb-12">
              FontSeek helps you find the perfect free and ready-to-use modern font to bring your brand's personality to life on your website and beyond. In under 3 minutes, get strategic recommendations, live web previews, and dev-ready code to elevate your site's design with intention.
            </p>

            <form onSubmit={handleSubmit} className="max-w-[400px] mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email to begin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3 mb-4 bg-white/5 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-emerald-500 text-black font-semibold rounded-full hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Starting...' : 'Start Quiz'}
              </button>
            </form>
          </div>
        </div>

        <footer className="relative z-30 py-6 px-4">
          <div className="container mx-auto flex items-center justify-center text-sm text-white/60">
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
        </footer>
      </div>
    </div>
  );
};