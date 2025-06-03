import React from 'react';
import { useQuizStore } from '../store/quizStore';
import { copyPacks } from '../data/copyPacks';

const QuizResults: React.FC = () => {
  const { scores, recommendations } = useQuizStore();
  
  // Default to the first copy pack if no matching aesthetic style is found
  const currentCopyPack = copyPacks[recommendations?.aestheticStyle || 'default'] || copyPacks.default;
  const isDarkMode = recommendations?.aestheticStyle === 'dark';
  const showLabels = false; // We can make this dynamic later if needed

  if (!recommendations || !currentCopyPack) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-neutral-500">Loading results...</p>
      </div>
    );
  }

  return (
    <>
      <div>
        {showLabels && <div className="font-sans text-xs mb-1 text-neutral-400">Heading • 36px/48px • Bold</div>}
        <h1 
          className={`text-3xl md:text-5xl font-bold transition-colors tracking-[-0.02em] ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {currentCopyPack.heading}
        </h1>
      </div>

      <div>
        {showLabels && <div className="font-sans text-xs mb-1 text-neutral-400">Subheading • 20px/24px • Medium</div>}
        <h2 
          className={`text-xl md:text-2xl font-medium transition-colors tracking-[-0.02em] ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {currentCopyPack.subheading}
        </h2>
      </div>

      <div>
        {showLabels && <div className="font-sans text-xs mb-1 text-neutral-400">Lead Paragraph • 18px/20px • Regular</div>}
        <p 
          className={`text-lg md:text-xl transition-colors tracking-[-0.02em] ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {currentCopyPack.leadParagraph}
        </p>
      </div>

      <div className="space-y-2">
        {showLabels && <div className="font-sans text-xs mb-1 text-neutral-400">Body Copy • 14px/16px • Regular</div>}
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
        {showLabels && <div className="font-sans text-xs mb-1 text-neutral-400">Fine Print • 11px/12px • Light</div>}
        <small 
          className={`text-[11px] md:text-xs font-light block transition-colors tracking-[-0.02em] ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          {currentCopyPack.finePrint}
        </small>
      </div>
    </>
  );
};

export default QuizResults;

export { QuizResults }