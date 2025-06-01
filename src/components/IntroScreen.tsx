import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';

export const IntroScreen: React.FC = () => {
  const { startQuiz, skipToResults } = useQuizStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Meta) + Alt + Option (Alt) + Enter
      if (e.metaKey && e.altKey && e.key === 'Enter') {
        startQuiz('skip@fontseek.com');
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
              required
              placeholder="Enter your email to start"
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
    </div>
  );
};