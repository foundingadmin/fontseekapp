import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { ArrowRight, RefreshCw, Share2, Eye, EyeOff, Shuffle, Sun, Moon } from 'lucide-react';
import { TraitScales } from './TraitScales';
import { copyPacks, type CopyPack } from '../data/copyPacks';
import { generateFontReport } from '../utils/pdfGenerator';

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
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    }
  }, [recommendations]);

  const shuffleCopyPack = () => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    const currentIndex = copyPacks.findIndex(pack => pack.styleId === currentCopyPack.styleId);
    let nextIndex = currentIndex;
    
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * copyPacks.length);
    }
    
    setCurrentCopyPack(copyPacks[nextIndex]);
    setTimeout(() => setIsShuffling(false), 500);
  };

  const getTopTraits = (font: typeof recommendations.primary) => {
    const traits = [
      { name: 'Casual', value: font.tone },
      { name: 'Energetic', value: font.energy },
      { name: 'Expressive', value: font.design },
      { name: 'Modern', value: font.era },
      { name: 'Geometric', value: font.structure }
    ];
    
    return traits
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .filter(trait => trait.value >= 3)
      .map(trait => trait.name);
  };

  const handleDownloadReport = () => {
    if (!recommendations || !scores) return;

    const traits = getTopTraits(recommendations.primary);
    const doc = generateFontReport({
      font: recommendations.primary,
      scores,
      traits
    });

    doc.save('FontSeek-Report.pdf');
  };

  const FontPreviewCard = ({ font, title, description }: { 
    font: typeof recommendations.primary;
    title: string;
    description: string;
  }) => (
    <div className="mb-8 bg-[#1C1F26] rounded-xl overflow-hidden shadow-xl">
      <div className="px-6 py-5 border-b border-[#2A2D36]">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-2xl font-bold text-white">{font.name}</p>
          <p className="text-sm text-white/60 mt-2 max-w-xl">{description}</p>
        </div>
      </div>

      <div className="p-8">
        <div className={`rounded-lg shadow-lg p-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-neutral-900' : 'bg-white'
        }`}>
          <div className="relative min-h-[600px]">
            <div className="space-y-8 mb-16">
              <div>
                {showLabels && <div className={`text-xs mb-1 ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Heading • 36px/48px • Bold</div>}
                <h1 
                  style={{ fontFamily: font.name }} 
                  className={`text-3xl md:text-5xl font-bold transition-colors ${
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
                  className={`text-xl md:text-2xl font-medium transition-colors ${
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
                  className={`text-lg md:text-xl transition-colors ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentCopyPack.leadParagraph}
                </p>
              </div>

              <div className="space-y-4">
                {showLabels && <div className={`text-xs mb-1 ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Body Copy • 14px/16px • Regular</div>}
                <p 
                  style={{ fontFamily: font.name }} 
                  className={`text-sm md:text-base transition-colors ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {currentCopyPack.body1}
                </p>
                <p 
                  style={{ fontFamily: font.name }} 
                  className={`text-sm md:text-base transition-colors ${
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
                  className={`text-[11px] md:text-xs font-light block transition-colors ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  {currentCopyPack.finePrint}
                </small>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex flex-col md:grid md:grid-cols-3 gap-2">
              <button
                onClick={shuffleCopyPack}
                disabled={isShuffling}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 md:py-1.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
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
          </div>
        </div>
      </div>

      <div className="px-6 py-5 border-t border-[#2A2D36]">
        <h3 className="text-lg font-semibold mb-2 text-white">Start Using This Font Right Now</h3>
        <p className="text-white/80 text-sm mb-4">
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
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={resetQuiz}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Quiz
        </button>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Download Report
        </button>
      </div>

      <div className="mb-12">
        <p className="text-white/60 uppercase tracking-wider mb-2 text-left">Your Brand's Aesthetic Style</p>
        <h1 className="text-4xl font-bold text-white mb-4 text-left">{recommendations.aestheticStyle}</h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {getTopTraits(recommendations.primary).map((trait) => (
            <span key={trait} className="bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full">
              {trait}
            </span>
          ))}
        </div>
        
        {scores && <TraitScales scores={scores} />}
      </div>

      <FontPreviewCard 
        font={recommendations.primary}
        title="Your Top Font Recommendation"
        description="Based on your answers, this Google Web Font is the best match for your brand. It's free to use and ready to download or embed today."
      />

      <FontPreviewCard 
        font={recommendations.secondary}
        title="Your Second Font Option"
        description="This alternative font matches your brand's personality while offering a slightly different aesthetic approach."
      />

      <FontPreviewCard 
        font={recommendations.tertiary}
        title="Your Third Font Option"
        description="Another strong match for your brand's personality, providing a distinct visual alternative."
      />
    </div>
  );
};