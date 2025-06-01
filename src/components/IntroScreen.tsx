import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';

export const IntroScreen: React.FC = () => {
  const { startQuiz, skipToResults } = useQuizStore();
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  useEffect(() => {
    // Load HubSpot script
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/v2.js';
    script.async = true;
    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: "242336861",
          formId: "5d375dfe-3d01-4816-9192-93063d111929",
          target: '#hubspot-form-container',
          onFormReady: () => {
            setIsFormLoaded(true);
          },
          onFormSubmitted: (form) => {
            startQuiz(form.submittedAt);
          },
          cssClass: 'hubspot-form',
          inlineMessage: "Starting quiz...",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://js.hsforms.net/forms/v2.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
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

          <div id="hubspot-form-container" className={`max-w-[400px] mx-auto transition-opacity duration-300 ${isFormLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* HubSpot form will be injected here */}
          </div>

          <style>{`
            .hubspot-form .hs-form {
              max-width: 400px !important;
              margin: 0 auto !important;
            }
            .hubspot-form .hs-form-field > label {
              display: none !important;
            }
            .hubspot-form .hs-input {
              width: 100% !important;
              padding: 0.75rem 1.5rem !important;
              background-color: #0F111A !important;
              border: 1px solid #2C2F3B !important;
              border-radius: 9999px !important;
              color: white !important;
              font-size: 0.875rem !important;
              margin-bottom: 1rem !important;
            }
            .hubspot-form .hs-input::placeholder {
              color: rgba(255, 255, 255, 0.4) !important;
            }
            .hubspot-form .hs-input:focus {
              outline: none !important;
              box-shadow: 0 0 0 2px #43DA7A !important;
            }
            .hubspot-form .hs-submit .hs-button {
              width: 100% !important;
              padding: 0.75rem 1.5rem !important;
              background-color: #43DA7A !important;
              border: none !important;
              border-radius: 9999px !important;
              color: black !important;
              font-weight: 600 !important;
              font-size: 0.875rem !important;
              cursor: pointer !important;
              transition: background-color 0.2s !important;
            }
            .hubspot-form .hs-submit .hs-button:hover {
              background-color: #3ac76c !important;
            }
            .hubspot-form .hs-error-msgs {
              list-style: none !important;
              padding: 0 !important;
              margin: -0.5rem 0 0.5rem 1.5rem !important;
            }
            .hubspot-form .hs-error-msg {
              color: #ef4444 !important;
              font-size: 0.75rem !important;
            }
            .hubspot-form .submitted-message {
              color: #43DA7A !important;
              font-size: 0.875rem !important;
              padding: 0.75rem !important;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};