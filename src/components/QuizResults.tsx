import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { ArrowRight, RefreshCw, Share2, Eye, EyeOff } from 'lucide-react';
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
  const [showLabels, setShowLabels] = useState(false);

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
          <div className="flex gap-4">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm"
            >
              {showLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showLabels ? 'Hide specs' : 'Show specs'}
            </button>
            <a
              href={recommendations.primary.googleFontsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors font-medium"
            >
              View Font <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div style={{ fontFamily: recommendations.primary.name }} className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
              Brand Typography System
            </p>
            {showLabels && (
              <p className="text-xs text-white/40 mt-1">
                Font size: Small (14px) • Weight: Semibold • Usage: Section label
              </p>
            )}
          </div>

          <div>
            <h1 className="text-5xl font-bold leading-tight">
              The quick brown fox jumps over the lazy dog
            </h1>
            {showLabels && (
              <p className="text-xs text-white/40 mt-1">
                Font size: Extra Large (48px) • Weight: Bold • Usage: Main heading
              </p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-medium leading-relaxed">
              Pack my box with five dozen liquor jugs
            </h2>
            {showLabels && (
              <p className="text-xs text-white/40 mt-1">
                Font size: Large (24px) • Weight: Medium • Usage: Subheading
              </p>
            )}
          </div>

          <div>
            <p className="text-xl font-normal leading-relaxed">
              How vexingly quick daft zebras jump! The five boxing wizards jump quickly.
            </p>
            {showLabels && (
              <p className="text-xs text-white/40 mt-1">
                Font size: Medium (20px) • Weight: Regular • Usage: Lead paragraph
              </p>
            )}
          </div>

          <div>
            <p className="text-base font-normal leading-loose">
              The quick brown fox jumps over the lazy dog. A wizard's job is to vex chumps quickly in fog.
              Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!
            </p>
            {showLabels && (
              <p className="text-xs text-white/40 mt-1">
                Font size: Normal (16px) • Weight: Regular • Usage: Body copy
              </p>
            )}
          </div>

          <div>
            <small className="text-xs font-light text-white/60 block">
              © 2025 FontSeek. All rights reserved. The quick brown fox jumps over the lazy dog.
            </small>
            {showLabels && (
              <p className="text-xs text-white/40 mt-1">
                Font size: Extra Small (12px) • Weight: Light • Usage: Fine print
              </p>
            )}
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