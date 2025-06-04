import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { quizQuestions } from '../data/quiz';
import { ArrowRight, RefreshCw, Share2, Eye, EyeOff, Shuffle, Sun, Moon, Bug } from 'lucide-react';
import { TraitScales } from './TraitScales';
import { copyPacks, type CopyPack } from '../data/copyPacks';
import { generateFontReport } from '../utils/pdfGenerator';
import { ContactForm } from './ContactForm';
import { getDisplayName } from '../utils/aestheticStyles';
import clsx from 'clsx';

const aestheticDescriptions: Record<string, { emoji: string; description: string }> = {
  'Bold & Expressive': {
    emoji: '🧃',
    description: "Your brand match reflects a personality that's bold, expressive, and packed with energy. This aesthetic thrives on making statements—ideal for brands that want to stand out, charm audiences, or inject a sense of fun into their communications."
  },
  'Warm & Approachable': {
    emoji: '🧠',
    description: 'This match reflects a balanced tone—friendly, professional, and adaptable. These fonts work beautifully for approachable brands that still need to be taken seriously. Think clarity with a touch of warmth.'
  },
  'Modern & Minimal': {
    emoji: '🛰',
    description: 'Your brand values precision, clarity, and modernity. These fonts are minimalist, clean, and calculated—ideal for tech-forward, future-facing, or design-savvy organizations.'
  },
  'Friendly & Playful': {
    emoji: '🫧',
    description: 'Friendly, casual, and fresh. These fonts are approachable and informal without being childish. This is the right pick for brands that want to feel helpful, human, and easygoing.'
  },
  'Universal & Neutral': {
    emoji: '🧰',
    description: 'Your brand values simplicity, speed, or versatility across platforms. This approach means no-frills performance and familiarity—ideal for internal apps, OS-native tools, or lightweight branding.'
  },
  'Classic & Credible': {
    emoji: '📚',
    description: 'A modern classic. This match tells us your brand appreciates structure and elegance but isn\'t stuck in the past. These fonts blend sharpness with sophistication—great for editorial, education, or premium service brands.'
  },
  'Elegant & Literary': {
    emoji: '📖',
    description: 'You lean into tradition, trust, and storytelling. This style fits brands with heritage, depth, and a classic sense of professionalism. Ideal for long-form content and legacy vibes.'
  },
  'Structured & Professional': {
    emoji: '🗂',
    description: 'You favor practicality and structure with just enough personality to keep things interesting. This timeless style is perfect for brands that want to feel grounded, neutral, and built to last.'
  }
};

const traitLabels = {
  tone: { low: "Formal", high: "Casual" },
  energy: { low: "Calm", high: "Energetic" },
  design: { low: "Minimal", high: "Expressive" },
  era: { low: "Classic", high: "Modern" },
  structure: { low: "Organic", high: "Geometric" }
};

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
  const [currentCopyPack, setCurrentCopyPack] = useState<CopyPack>(copyPacks[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (!scores && !recommendations) {
      calculateResults();
    }
  }, [scores, recommendations, calculateResults]);

  useEffect(() => {
    if (recommendations) {
      loadGoogleFont(recommendations.primary.name);
      loadGoogleFont(recommendations.secondary.name);
      loadGoogleFont(recommendations.tertiary.name);
      
      setShowFallbackMessage(
        recommendations.aestheticStyle === 'Humanist Sans' &&
        recommendations.primary.name === 'Karla' &&
        recommendations.secondary.name === 'Work Sans' &&
        recommendations.tertiary.name === 'Cabin'
      );
    }
  }, [recommendations]);

  const getTopTraits = () => {
    if (!scores) return [];

    const traitScores = [
      { trait: 'tone', score: scores.tone },
      { trait: 'energy', score: scores.energy },
      { trait: 'design', score: scores.design },
      { trait: 'era', score: scores.era },
      { trait: 'structure', score: scores.structure }
    ];

    traitScores.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      
      const priority = ['energy', 'design', 'tone', 'era', 'structure'];
      return priority.indexOf(a.trait) - priority.indexOf(b.trait);
    });

    return traitScores
      .filter(({ score }) => score !== 3)
      .slice(0, 3)
      .map(({ trait, score }) => {
        const label = traitLabels[trait as keyof typeof traitLabels];
        return score >= 4 ? label.high : label.low;
      })
      .filter(Boolean);
  };

  const shuffleCopyPack = () => {
    const currentIndex = copyPacks.findIndex(pack => pack.styleId === currentCopyPack.styleId);
    let nextIndex = currentIndex;
    
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * copyPacks.length);
    }
    
    setCurrentCopyPack(copyPacks[nextIndex]);
  };

  const handleDownloadReport = () => {
    if (!recommendations || !scores) return;

    const traits = getTopTraits();
    const doc = generateFontReport({
      font: recommendations.primary,
      scores,
      traits
    });

    doc.save('FontSeek-Report.pdf');
  };

  const FontPreviewCard = ({ font, index }: { 
    font: typeof recommendations.primary;
    index: number;
  }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
    const [currentCopyPack, setCurrentCopyPack] = useState<CopyPack>(copyPacks[0]);

    const shuffleCopyPack = () => {
      const currentIndex = copyPacks.findIndex(pack => pack.styleId === currentCopyPack.styleId);
      let nextIndex = currentIndex;
      
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * copyPacks.length);
      }
      
      setCurrentCopyPack(copyPacks[nextIndex]);
    };

    const SpecLabel = ({ children }: { children: React.ReactNode }) => (
      <div className={`font-sans text-xs mb-1 ${
        isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
      }`}>
        {children}
      </div>
    );

    return (
      <div className="mb-8 bg-[#1C1F26] rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-[#2A2D36]">
          <div>
            <p className="text-2xl font-bold text-white tracking-[-0.02em]">{font.name}</p>
            <p className="text-sm text-white/60 mt-2 max-w-xl tracking-[-0.02em]">
              A {getDisplayName(font.aestheticStyle).toLowerCase()} typeface that aligns with your brand's personality.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <div className={clsx(
            'rounded-lg shadow-lg p-4 md:p-8 transition-colors duration-300',
            isDarkMode ? 'bg-neutral-900' : 'bg-white'
          )}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                <button
                  onClick={shuffleCopyPack}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-colors text-sm',
                    isDarkMode 
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                      : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                  )}
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="hidden md:inline">Shuffle copy</span>
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-colors text-sm',
                    isDarkMode 
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                      : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                  )}
                >
                  {showLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="hidden md:inline">{showLabels ? 'Hide specs' : 'Show specs'}</span>
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-colors text-sm',
                    isDarkMode 
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                      : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                  )}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="hidden md:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
                </button>
              </div>

              <div 
                style={{ 
                  fontFamily: font.name === 'Baloo 2' ? "'Baloo\\ 2', cursive" : font.embedCode 
                }}
                className="space-y-4"
              >
                <div>
                  {showLabels && <SpecLabel>Heading • 36px/48px • Bold</SpecLabel>}
                  <h1 
                    className={`text-3xl md:text-5xl font-bold transition-colors tracking-[-0.02em] ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {currentCopyPack.heading}
                  </h1>
                </div>

                <div>
                  {showLabels && <SpecLabel>Subheading • 20px/24px • Medium</SpecLabel>}
                  <h2 
                    className={`text-xl md:text-2xl font-medium transition-colors tracking-[-0.02em] ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {currentCopyPack.subheading}
                  </h2>
                </div>

                <div>
                  {showLabels && <SpecLabel>Lead Paragraph • 18px/20px • Regular</SpecLabel>}
                  <p 
                    className={`text-lg md:text-xl transition-colors tracking-[-0.02em] ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {currentCopyPack.leadParagraph}
                  </p>
                </div>

                <div className="space-y-2">
                  {showLabels && <SpecLabel>Body Copy • 14px/16px • Regular</SpecLabel>}
                  <p 
                    className={`text-sm md:text-base transition-colors tracking-[-0.02em] ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {currentCopyPack.body1}
                  </p>
                  <p 
                    className={`text-sm md:text-base transition-colors tracking-[-0.02em] ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {currentCopyPack.body2}
                  </p>
                </div>

                <div>
                  {showLabels && <SpecLabel>Fine Print • 11px/12px • Light</SpecLabel>}
                  <small 
                    className={`text-[11px] md:text-xs font-light block transition-colors tracking-[-0.02em] ${
                      isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    {currentCopyPack.finePrint}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-[#2A2D36]">
          <h3 className="text-lg font-semibold mb-2 text-white tracking-[-0.02em]">Get this free font</h3>
          <p className="text-white/80 text-sm mb-4 tracking-[-0.02em]">
            Install it to your computer or embed it on your website in seconds.
          </p>
          <a
            href={font.googleFontsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors font-semibold w-fit"
          >
            Use {font.name} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  };

  const DebugInfo = () => {
    if (!scores) return null;
    
    return (
      <div className="mb-8 p-4 bg-white/5 rounded-lg text-sm font-mono">
        <h3 className="text-emerald-400 mb-2">Debug Information</h3>
        <pre className="text-white/80 overflow-x-auto">
          {JSON.stringify(scores, null, 2)}
        </pre>
      </div>
    );
  };

  if (!recommendations || !scores) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const displayName = getDisplayName(recommendations.aestheticStyle);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute -left-12 top-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Toggle debug info"
        >
          <Bug className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {showDebug && <DebugInfo />}

      {showFallbackMessage && (
        <div className="mb-8 px-4 py-3 bg-white/5 rounded-lg text-white/60 text-sm text-center">
          We had a little trouble finding a perfect match for your font style, so we've shown the closest match instead.
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-8">
        <button
          onClick={resetQuiz}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors w-full md:w-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Quiz
        </button>
        
        <button
          onClick={handleDownloadReport}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors w-full md:w-auto"
        >
          <Share2 className="w-4 h-4" />
          Download Report
        </button>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-[-0.02em]">
          {aestheticDescriptions[displayName]?.emoji} {displayName}
        </h1>
        <p className="text-white/60 text-lg mb-8">
          {aestheticDescriptions[displayName]?.description || 
           `Based on your answers, your brand's font personality aligns with the ${displayName.toLowerCase()} style.`}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {getTopTraits().map((trait) => (
            <span key={trait} className="bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full tracking-[-0.02em]">
              {trait}
            </span>
          ))}
        </div>
        
        {scores && <TraitScales scores={scores} />}
      </div>

      <FontPreviewCard font={recommendations.primary} index={0} />
      <FontPreviewCard font={recommendations.secondary} index={1} />
      <FontPreviewCard font={recommendations.tertiary} index={2} />

      <ContactForm onDownloadReport={handleDownloadReport} />
    </div>
  );
};