import React, { useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';
import { ArrowRight, RefreshCw, Share2 } from 'lucide-react';
import { RadarChart } from './RadarChart';

function loadGoogleFont(fontName: string) {
  const formatted = fontName.replace(/ /g, '+');
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${formatted}:wght@400;500;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

export const QuizResults: React.FC = () => {
  const { scores, recommendations, calculateResults, resetQuiz } = useQuizStore();

  useEffect(() => {
    if (!scores && !recommendations) {
      calculateResults();
    }
  }, [scores, recommendations, calculateResults]);

  useEffect(() => {
    if (recommendations) {
      // Load fonts when recommendations are available
      loadGoogleFont(recommendations.primary.name);
      loadGoogleFont(recommendations.secondary.name);
      loadGoogleFont(recommendations.tertiary.name);
    }
  }, [recommendations]);

  if (!recommendations || !scores) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={resetQuiz}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Quiz
        </button>
        <button
          onClick={() => window.open('https://linkedin.com/share', '_blank')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share on LinkedIn
        </button>
      </div>

      <div className="mb-12 text-center">
        <p className="text-white/60 uppercase tracking-wider mb-2">Your Brand's Aesthetic Style</p>
        <h1 className="text-4xl font-bold text-white mb-8">{recommendations.aestheticStyle}</h1>
        
        {scores && <RadarChart scores={scores} />}
      </div>

      {/* Primary Font */}
      <div className="mb-16 bg-white/10 rounded-xl p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Primary Font: {recommendations.primary.name}</h2>
          <a
            href={recommendations.primary.googleFontsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors font-medium"
          >
            View Font <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        
        <div style={{ fontFamily: recommendations.primary.name }}>
          <div className="mb-8">
            <h1 style={{ fontWeight: 700 }} className="text-5xl">
              The quick brown fox jumps over the lazy dog
            </h1>
            <div className="mt-1 text-white/40 text-sm">5xl / Bold (700)</div>
          </div>
          <div className="mb-8">
            <h2 style={{ fontWeight: 500 }} className="text-4xl">
              Pack my box with five dozen liquor jugs
            </h2>
            <div className="mt-1 text-white/40 text-sm">4xl / Medium (500)</div>
          </div>
          <div className="mb-8">
            <p style={{ fontWeight: 400 }} className="text-2xl">
              How vexingly quick daft zebras jump
            </p>
            <div className="mt-1 text-white/40 text-sm">2xl / Regular (400)</div>
          </div>
        </div>
      </div>

      {/* Secondary & Tertiary Fonts */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Secondary Font', font: recommendations.secondary },
          { title: 'Tertiary Font', font: recommendations.tertiary }
        ].map(({ title, font }) => (
          <div key={font.name} className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{title}: {font.name}</h3>
              <a
                href={font.googleFontsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                View Font <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div style={{ fontFamily: font.name }}>
              <p style={{ fontWeight: 700 }} className="text-2xl mb-4">
                The quick brown fox jumps over the lazy dog
              </p>
              <p style={{ fontWeight: 400 }} className="text-base mb-1">
                Pack my box with five dozen liquor jugs
              </p>
              <p className="text-sm text-white/60">{font.personalityTags.join(' • ')}</p>
              <p className="mt-2 text-sm text-white/60">Recommended for: {font.recommendedFor.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};