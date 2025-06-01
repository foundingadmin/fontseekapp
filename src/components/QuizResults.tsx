import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { ArrowRight, RefreshCw, Share2, Eye, EyeOff, Shuffle } from 'lucide-react';
import { TraitScales } from './TraitScales';
import { copyPacks, type CopyPack } from '../data/copyPacks';
import { jsPDF } from "jspdf";
import logoWhite from "../assets/Founding-v1-Wordmark-white.svg";

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

  const generatePDF = async () => {
    if (!recommendations || !scores) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Load logo
    const img = new Image();
    img.src = logoWhite;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Add logo
    const logoWidth = 60;
    const logoHeight = (img.height / img.width) * logoWidth;
    doc.addImage(img, 'PNG', margin, margin, logoWidth, logoHeight);

    // Title
    doc.setFontSize(24);
    doc.text('Your Font Recommendation Report', margin, margin + logoHeight + 20);

    // Aesthetic Style
    doc.setFontSize(16);
    doc.text('Brand Aesthetic Style:', margin, margin + logoHeight + 40);
    doc.setFontSize(20);
    doc.text(recommendations.aestheticStyle, margin, margin + logoHeight + 50);

    // Primary Font Recommendation
    doc.setFontSize(16);
    doc.text('Your Recommended Font:', margin, margin + logoHeight + 70);
    doc.setFontSize(20);
    const fontName = recommendations.primary.name;
    doc.text(fontName, margin, margin + logoHeight + 80);

    // Font Details
    doc.setFontSize(12);
    doc.text('Personality:', margin, margin + logoHeight + 95);
    doc.setFontSize(10);
    doc.text(recommendations.primary.personalityTags.join(' • '), margin, margin + logoHeight + 105);

    doc.setFontSize(12);
    doc.text('Recommended For:', margin, margin + logoHeight + 120);
    doc.setFontSize(10);
    doc.text(recommendations.primary.recommendedFor.join(', '), margin, margin + logoHeight + 130);

    // Implementation Code
    doc.setFontSize(12);
    doc.text('How to Use This Font:', margin, margin + logoHeight + 145);
    
    // HTML Link tag
    const htmlCode = `<link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;700&display=swap" rel="stylesheet">`;
    doc.setFontSize(8);
    doc.text('HTML:', margin, margin + logoHeight + 155);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, margin + logoHeight + 158, contentWidth, 10, 'F');
    doc.setTextColor(60, 60, 60);
    doc.text(htmlCode, margin + 2, margin + logoHeight + 165);
    doc.setTextColor(0, 0, 0);

    // CSS font-family
    const cssCode = `font-family: '${fontName}', ${recommendations.primary.embedCode.split(',').slice(1).join(',')};`;
    doc.setFontSize(8);
    doc.text('CSS:', margin, margin + logoHeight + 175);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, margin + logoHeight + 178, contentWidth, 10, 'F');
    doc.setTextColor(60, 60, 60);
    doc.text(cssCode, margin + 2, margin + logoHeight + 185);
    doc.setTextColor(0, 0, 0);

    // Brand Personality Traits
    doc.setFontSize(16);
    doc.text('Brand Personality Traits', margin, margin + logoHeight + 205);

    // Draw trait bars
    const traits = [
      { name: 'Tone', value: scores.tone, left: 'Formal', right: 'Casual' },
      { name: 'Energy', value: scores.energy, left: 'Calm', right: 'Energetic' },
      { name: 'Design', value: scores.design, left: 'Minimal', right: 'Expressive' },
      { name: 'Era', value: scores.era, left: 'Classic', right: 'Modern' },
      { name: 'Structure', value: scores.structure, left: 'Organic', right: 'Geometric' }
    ];

    let yOffset = margin + logoHeight + 220;
    traits.forEach((trait, index) => {
      // Trait name
      doc.setFontSize(10);
      doc.text(trait.name, margin, yOffset + (index * 20));

      // Bar background
      doc.setFillColor(220, 220, 220);
      doc.rect(margin + 50, yOffset - 4 + (index * 20), 100, 4, 'F');

      // Bar value
      doc.setFillColor(67, 218, 122); // emerald-500
      doc.rect(margin + 50, yOffset - 4 + (index * 20), (trait.value / 5) * 100, 4, 'F');

      // Labels
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(trait.left, margin + 50, yOffset + 5 + (index * 20));
      doc.text(trait.right, margin + 150 - doc.getTextWidth(trait.right), yOffset + 5 + (index * 20));
      doc.setTextColor(0, 0, 0);
    });

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - margin;
    doc.setFontSize(10);
    doc.text('Want to learn more about strategic typography?', margin, footerY - 15);
    doc.setTextColor(67, 218, 122);
    doc.text('Contact us at hello@fontseek.com', margin, footerY - 5);

    // Save the PDF
    doc.save('FontSeek-Recommendation.pdf');
  };

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
          onClick={generatePDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Download Report
        </button>
      </div>

      <div className="mb-12">
        <p className="text-white/60 uppercase tracking-wider mb-2 text-left">Your Brand's Aesthetic Style</p>
        <h1 className="text-4xl font-bold text-white mb-8 text-left">{recommendations.aestheticStyle}</h1>
        
        {scores && <TraitScales scores={scores} />}
      </div>

      {/* Primary Font */}
      <div className="mb-16 bg-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Your Top Font Recommendation</h2>
            <p className="text-2xl font-bold text-white">{recommendations.primary.name}</p>
            <p className="text-sm text-white/60 mt-2">Based on your answers, this Google Web Font is the best match for your brand. It's free to use and ready to download or embed today.</p>
          </div>

          <div className="flex gap-2 mb-8">
            <button
              onClick={shuffleCopyPack}
              disabled={isShuffling}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle Copy Style
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm"
            >
              {showLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showLabels ? 'Hide specs' : 'Show specs'}
            </button>
          </div>
          
          <div className="space-y-8">
            <div>
              {showLabels && <div className="text-xs text-white/40 mb-1">Heading • 48px • Bold</div>}
              <h1 style={{ fontFamily: recommendations.primary.name }} className="text-5xl font-bold leading-tight">
                {currentCopyPack.heading}
              </h1>
            </div>

            <div>
              {showLabels && <div className="text-xs text-white/40 mb-1">Subheading • 24px • Medium</div>}
              <h2 style={{ fontFamily: recommendations.primary.name }} className="text-2xl font-medium leading-relaxed">
                {currentCopyPack.subheading}
              </h2>
            </div>

            <div>
              {showLabels && <div className="text-xs text-white/40 mb-1">Lead Paragraph • 20px • Regular</div>}
              <p style={{ fontFamily: recommendations.primary.name }} className="text-xl font-normal leading-relaxed">
                {currentCopyPack.leadParagraph}
              </p>
            </div>

            <div className="space-y-4">
              {showLabels && <div className="text-xs text-white/40 mb-1">Body Copy • 16px • Regular</div>}
              <p style={{ fontFamily: recommendations.primary.name }} className="text-base font-normal leading-loose">
                {currentCopyPack.body1}
              </p>
              <p style={{ fontFamily: recommendations.primary.name }} className="text-base font-normal leading-loose">
                {currentCopyPack.body2}
              </p>
            </div>

            <div>
              {showLabels && <div className="text-xs text-white/40 mb-1">Fine Print • 12px • Light</div>}
              <small style={{ fontFamily: recommendations.primary.name }} className="text-xs font-light text-white/60 block">
                {currentCopyPack.finePrint}
              </small>
            </div>
          </div>
        </div>

        <div className="bg-emerald-500 px-6 py-5">
          <h3 className="text-lg font-semibold mb-2 text-black">Start Using This Font Right Now</h3>
          <p className="text-black/80 text-sm mb-4">
            This Google Web Font is free to use for your brand. You can download it to your computer or embed it in your website in seconds using the tools on Google Fonts.
          </p>
          <a
            href={recommendations.primary.googleFontsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors font-semibold w-fit mt-4"
          >
            Use This Font <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Second and Third Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Second Option', font: recommendations.secondary },
          { title: 'Third Option', font: recommendations.tertiary }
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
              {showLabels && <div className="text-xs text-white/40 mb-1">Display • 24px • Bold</div>}
              <p style={{ fontWeight: 700 }} className="text-2xl mb-4">
                The quick brown fox jumps over the lazy dog
              </p>
              {showLabels && <div className="text-xs text-white/40 mb-1">Body • 16px • Regular</div>}
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