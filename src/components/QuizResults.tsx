import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../store/quizStore';
import { quizQuestions } from '../data/quiz';
import { RefreshCw, Share2, Eye, EyeOff, Shuffle, Sun, Moon, ArrowRight } from 'lucide-react';
import { TraitScales } from './TraitScales';
import { copyPacks, type CopyPack } from '../data/copyPacks';
import { generateFontReport } from '../utils/pdfGenerator';
import { ContactForm } from './ContactForm';
import { getDisplayName } from '../utils/aestheticStyles';
import { aestheticDescriptions } from '../utils/aestheticStyles';
import clsx from 'clsx';

const traitLabels = {
  tone: { low: "Formal", high: "Casual" },
  energy: { low: "Calm", high: "Energetic" },
  design: { low: "Minimal", high: "Expressive" },
  era: { low: "Classic", high: "Modern" },
  structure: { low: "Organic", high: "Geometric" }
};

interface QuizResultsProps {
  onShowInfo: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ onShowInfo }) => {
  const { scores, visualScores, recommendations, calculateResults, resetQuiz } = useQuizStore();
  const [showLabels, setShowLabels] = useState(false);
  const [currentCopyPack, setCurrentCopyPack] = useState<CopyPack>(copyPacks[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);

  useEffect(() => {
    if (!scores && !recommendations) {
      calculateResults();
    }
  }, [scores, recommendations, calculateResults]);

  useEffect(() => {
    if (recommendations) {
      const loadGoogleFont = (fontName: string) => {
        const formatted = fontName.replace(/ /g, '+');
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${formatted}:wght@400;500;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      };

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

  if (!recommendations || !scores) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const displayName = getDisplayName(recommendations.aestheticStyle);

  return (
    <div className="w-full max-w-3xl mx-auto pt-6">
      <div className="flex flex-row items-center justify-between gap-4 mb-8">
        <button
          onClick={resetQuiz}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full glass-card text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all duration-300 group whitespace-nowrap"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400 transition-transform group-hover:rotate-180 duration-500" />
          <span className="text-sm">Retake</span>
        </button>
        
        <button
          onClick={handleDownloadReport}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full glass-card text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all duration-300 group whitespace-nowrap"
        >
          <Share2 className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-1 duration-300" />
          <span className="text-sm">Download</span>
        </button>
      </div>

      <div className="glass-card rounded-[2rem] p-8 mb-12">
        {showFallbackMessage && (
          <div className="mb-8 px-4 py-3 bg-white/5 rounded-lg text-white/60 text-sm text-center">
            We had a little trouble finding a perfect match for your font style, so we've shown the closest match instead.
          </div>
        )}

        <div className="text-sm font-medium text-emerald-400 mb-2 tracking-[-0.02em]">Your Style</div>
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

      <ContactForm onDownloadReport={handleDownloadReport} onShowInfo={onShowInfo} />
    </div>
  );
};

const FontPreviewCard = ({ font, index }: { 
  font: typeof recommendations.primary;
  index: number;
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
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
    <div className="mb-8 glass-card rounded-xl overflow-hidden shadow-xl">
      <div className="px-6 py-5 border-b border-white/10">
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
          isDarkMode ? 'bg-black' : 'bg-white'
        )}>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <button
                onClick={shuffleCopyPack}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-colors text-sm',
                  isDarkMode 
                    ? 'bg-white/5 text-white hover:bg-white/10' 
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
                    ? 'bg-white/5 text-white hover:bg-white/10' 
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
                    ? 'bg-white/5 text-white hover:bg-white/10' 
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

      <div className="px-6 py-5 border-t border-white/10">
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