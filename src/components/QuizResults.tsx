import React, { useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';
import { ArrowRight, RefreshCw, Share2 } from 'lucide-react';
import { RadarChart } from './RadarChart';

export const QuizResults: React.FC = () => {
  const { scores, recommendations, calculateResults, resetQuiz } = useQuizStore();
  
  useEffect(() => {
    if (!scores && !recommendations) {
      calculateResults();
    }

    if (recommendations) {
      const fonts = [
        recommendations.primary,
        recommendations.secondary,
        recommendations.tertiary
      ].filter((font, index, self) => 
        index === self.findIndex((f) => f.name === font.name)
      );

      const link = document.createElement('link');
      const fontFamilies = fonts
        .map(font => `family=${font.name.replace(/\s+/g, '+')}:wght@400;500;700`)
        .join('&');
      link.href = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [scores, recommendations, calculateResults]);

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
        
        <div className="space-y-6" style={{ fontFamily: recommendations.primary.embedCode }}>
          <div>
            <h1 className="text-5xl font-bold">The quick brown fox jumps over the lazy dog</h1>
            <div className="mt-1 text-white/40 text-sm">5xl / Bold</div>
          </div>
          <div>
            <h2 className="text-4xl font-semibold">Pack my box with five dozen liquor jugs</h2>
            <div className="mt-1 text-white/40 text-sm">4xl / Semibold</div>
          </div>
          <div>
            <h3 className="text-2xl font-medium">How vexingly quick daft zebras jump</h3>
            <div className="mt-1 text-white/40 text-sm">2xl / Medium</div>
          </div>
          <div>
            <p className="text-xl">The five boxing wizards jump quickly</p>
            <div className="mt-1 text-white/40 text-sm">xl / Regular</div>
          </div>
          <div>
            <p className="text-base">Sphinx of black quartz, judge my vow</p>
            <div className="mt-1 text-white/40 text-sm">base / Regular</div>
          </div>
          <div>
            <p className="text-sm">Waltz, nymph, for quick jigs vex Bud</p>
            <div className="mt-1 text-white/40 text-sm">sm / Regular</div>
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
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <a
                href={font.googleFontsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                View Font <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div style={{ fontFamily: font.embedCode }}>
              <p className="text-2xl text-white mb-2">{font.name}</p>
              <p className="text-base mb-1">The quick brown fox jumps over the lazy dog</p>
              <p className="text-sm text-white/60">{font.personalityTags.join(' • ')}</p>
              <p className="mt-2 text-sm text-white/60">Recommended for: {font.recommendedFor.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};