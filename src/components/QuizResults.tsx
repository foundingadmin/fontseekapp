import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { quizQuestions } from '../data/quiz';
import { ArrowRight, RefreshCw, Share2, Eye, EyeOff, Shuffle, Sun, Moon, Bug } from 'lucide-react';
import { TraitScales } from './TraitScales';
import { copyPacks, type CopyPack } from '../data/copyPacks';
import { generateFontReport } from '../utils/pdfGenerator';
import { ContactForm } from './ContactForm';

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

    // Sort by score (descending) and break ties using priority order
    traitScores.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      
      const priority = ['energy', 'design', 'tone', 'era', 'structure'];
      return priority.indexOf(a.trait) - priority.indexOf(b.trait);
    });

    return traitScores
      .filter(({ score }) => score !== 3) // Skip neutral scores
      .slice(0, 3) // Take top 3
      .map(({ trait, score }) => {
        const label = traitLabels[trait as keyof typeof traitLabels];
        return score >= 4 ? label.high : label.low;
      })
      .filter(Boolean); // Remove any undefined values
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
  }) => (
    <div className="mb-8 bg-[#1C1F26] rounded-xl overflow-hidden shadow-xl">
      <div className="px-6 py-5 border-b border-[#2A2D36]">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2 tracking-[-0.02em]">
            Suggested Font Option {index + 1}
          </h2>
          <p className="text-2xl font-bold text-white tracking-[-0.02em]">{font.name}</p>
          <p className="text-sm text-white/60 mt-2 max-w-xl tracking-[-0.02em]">
            A {font.aestheticStyle.toLowerCase()} typeface that aligns with your brand's personality.
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className={`rounded-lg shadow-lg p-4 md:p-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-neutral-900' : 'bg-white'
        }`}>
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row gap-2 mb-8">
              <button
                onClick={shuffleCopyPack}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 md:py-1.5 rounded-lg transition-colors text-sm ${
                  isDarkMode 
                    ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                <Shuffle className="w-4 h-4" />
                Shuffle copy
              </button>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 md:py-1.5 rounded-lg transition-colors text-sm ${
                  isDarkMode 
                    ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {showLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showLabels ? 'Hide specs' : 'Show specs'}
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 md:py-1.5 rounded-lg transition-colors text-sm ${
                  isDarkMode 
                    ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? 'Light mode' : 'Dark mode'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                {showLabels && <div className={`text-xs mb-1 ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Heading • 36px/48px • Bold</div>}
                <h1 
                  style={{ fontFamily: font.name }} 
                  className={`text-3xl md:text-5xl font-bold transition-colors tracking-[-0.02em] ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentCopyPack.heading}
                </h1>
              </div>

              <div>
                {showLabels && <div className={`text-xs mb-1 ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Subheading • 20px/24px • Medium</div>}
                <h2 
                  style={{ fontFamily: font.name }} 
                  className={`text-xl md:text-2xl font-medium transition-colors tracking-[-0.02em] ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentCopyPack.subheading}
                </h2>
              </div>

              <div>
                {showLabels && <div className={`text-xs mb-1 ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Lead Paragraph • 18px/20px • Regular</div>}
                <p 
                  style={{ fontFamily: font.name }} 
                  className={`text-lg md:text-xl transition-colors tracking-[-0.02em] ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentCopyPack.leadParagraph}
                </p>
              </div>

              <div className="space-y-2">
                {showLabels && <div className={`text-xs mb-1 ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Body Copy • 14px/16px • Regular</div>}
                <p 
                  style={{ fontFamily: font.name }} 
                  className={`text-sm md:text-base transition-colors tracking-[-0.02em] ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentCopyPack.body1}
                </p>
                <p 
                  style={{ fontFamily: font.name }} 
                  className={`text-sm md:text-base transition-colors tracking-[-0.02em] ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentCopyPack.body2}
                </p>
              </div>

              <div>
                {showLabels && <div className={`text-xs mb-1 ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Fine Print • 11px/12px • Light</div>}
                <small 
                  style={{ fontFamily: font.name }} 
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
        <h3 className="text-lg font-semibold mb-2 text-white tracking-[-0.02em]">Start Using This Font Right Now</h3>
        <p className="text-white/80 text-sm mb-4 tracking-[-0.02em]">
          This Google Web Font is free to use for your brand. You can download it to your computer or embed it in your website in seconds using the tools on Google Fonts.
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

  if (!recommendations || !scores) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
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
        
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors w-full md:w-auto order-last md:order-none"
        >
          <Bug className="w-4 h-4" />
          Debug
        </button>
      </div>

      {showDebug && (
        <div className="mb-8 p-4 bg-white/5 rounded-lg overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-white">Debug Information</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">User Scores:</h4>
              <pre className="text-xs text-white/60 font-mono">
                {JSON.stringify(scores, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-2">Font Recommendations:</h4>
              <pre className="text-xs text-white/60 font-mono">
                {JSON.stringify(recommendations, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-[-0.02em]">{recommendations.aestheticStyle}</h1>
        <p className="text-white/60 text-lg mb-8">
          Based on your answers, your brand's font personality aligns with the {recommendations.aestheticStyle.toLowerCase()} style.
          This aesthetic combines {getTopTraits().map((trait, i, arr) => 
            i === arr.length - 1 ? `and ${trait.toLowerCase()}` : `${trait.toLowerCase()}, `
          )} to create a distinctive visual voice.
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