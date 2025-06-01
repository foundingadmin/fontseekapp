import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';

export const IntroScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const { startQuiz, skipToResults } = useQuizStore();

  useEffect(() => {
    // Load HubSpot script
    const script = document.createElement('script');
    script.src = '//js.hsforms.net/forms/embed/v2.js';
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).hbspt) {
        (window as any).hbspt.forms.create({
          region: "na1",
          portalId: "242336861",
          formId: "5d375dfe-3d01-4816-9192-93063d111929",
          target: '#hubspot-form-container',
          onFormSubmit: (form: any) => {
            const email = form.getField('email').value;
            startQuiz(email);
          }
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [startQuiz]);

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

          <div id="hubspot-form-container" className="max-w-[400px] mx-auto">
            {/* HubSpot form will be injected here */}
          </div>
        </div>
      </div>
    </div>
  );
};