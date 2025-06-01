import React, { useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';

export const IntroScreen: React.FC = () => {
  const { skipToResults } = useQuizStore();

  useEffect(() => {
    // Load HubSpot form script
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/embed/v2.js';
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.hbspt) {
        // @ts-ignore
        window.hbspt.forms.create({
          region: "na2",
          portalId: "242336861",
          formId: "5d375dfe-3d01-4816-9192-93063d111929",
          target: "#fontseek-email-form",
          css: `
            .hs-form {
              font-family: inherit;
            }
            .hs-form-field label {
              display: none;
            }
            .hs-input {
              width: 100% !important;
              padding: 0.75rem 1.5rem !important;
              background-color: #0F111A !important;
              border: 1px solid #2C2F3B !important;
              border-radius: 9999px !important;
              color: white !important;
              font-size: 0.875rem !important;
              margin-bottom: 1rem !important;
            }
            .hs-input::placeholder {
              color: rgba(255, 255, 255, 0.4) !important;
            }
            .hs-input:focus {
              outline: none !important;
              box-shadow: 0 0 0 2px #43DA7A !important;
            }
            .hs-button {
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
            .hs-button:hover {
              background-color: #3ac76b !important;
            }
            .hs-error-msg {
              color: #ef4444 !important;
              font-size: 0.75rem !important;
              margin-top: -0.5rem !important;
              margin-bottom: 0.5rem !important;
              padding-left: 1.5rem !important;
            }
          `
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'Enter') {
        skipToResults();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.removeChild(script);
    };
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

          <div className="max-w-[400px] mx-auto">
            <div id="fontseek-email-form"></div>
          </div>
        </div>
      </div>
    </div>
  );
};