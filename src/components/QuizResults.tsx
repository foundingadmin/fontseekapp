import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { ArrowRight, RefreshCw, FileDown, Eye, EyeOff, Shuffle } from 'lucide-react';
import { TraitScales } from './TraitScales';
import { copyPacks, type CopyPack } from '../data/copyPacks';
import { jsPDF } from 'jspdf';

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const getTraitDescription = (trait: string, score: number): string => {
    const descriptions: Record<string, string[]> = {
      tone: ['Very Formal', 'Formal', 'Balanced', 'Casual', 'Very Casual'],
      energy: ['Very Calm', 'Calm', 'Balanced', 'Energetic', 'Very Energetic'],
      design: ['Very Minimal', 'Minimal', 'Balanced', 'Expressive', 'Very Expressive'],
      era: ['Very Classic', 'Classic', 'Balanced', 'Modern', 'Very Modern'],
      structure: ['Very Organic', 'Organic', 'Balanced', 'Geometric', 'Very Geometric']
    };
    return descriptions[trait.toLowerCase()][score - 1];
  };

  const getTraitEndLabels = (trait: string): [string, string] => {
    const labels: Record<string, [string, string]> = {
      tone: ['Formal', 'Casual'],
      energy: ['Calm', 'Energetic'],
      design: ['Minimal', 'Expressive'],
      era: ['Classic', 'Modern'],
      structure: ['Organic', 'Geometric']
    };
    return labels[trait.toLowerCase()];
  };

  const generatePDF = async () => {
    if (!recommendations || !scores || isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Load and add logo with proper SVG to PNG conversion
      await new Promise((resolve, reject) => {
        const logo = new Image();
        logo.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = logo.width;
            canvas.height = logo.height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }

            ctx.drawImage(logo, 0, 0);
            const pngDataUrl = canvas.toDataURL('image/png');
            
            // Add the PNG image to the PDF in black
            doc.addImage(pngDataUrl, 'PNG', 150, 15, 40, 12);
            resolve(null);
          } catch (error) {
            reject(error);
          }
        };
        logo.onerror = () => reject(new Error('Failed to load logo'));
        logo.src = '/src/assets/Founding-v1-Wordmark-white.svg';
      });

      // Header
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text('FontSeek Report', 20, 30);
      
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text('Font Personality Profile', 20, 40);

      // Trait Scores with visual bars and end labels
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const traits = [
        { name: 'Tone', description: getTraitDescription('tone', scores.tone) },
        { name: 'Energy', description: getTraitDescription('energy', scores.energy) },
        { name: 'Design', description: getTraitDescription('design', scores.design) },
        { name: 'Era', description: getTraitDescription('era', scores.era) },
        { name: 'Structure', description: getTraitDescription('structure', scores.structure) }
      ];

      let y = 60;
      traits.forEach((trait) => {
        const score = scores[trait.name.toLowerCase() as keyof typeof scores];
        const [startLabel, endLabel] = getTraitEndLabels(trait.name);
        
        // Trait name and description
        doc.setFontSize(11);
        doc.text(`${trait.name}: ${trait.description}`, 20, y);
        
        // Draw scale bar with end labels
        y += 5;
        
        // Start label
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(startLabel, 20, y - 2);
        
        // End label
        const endLabelWidth = doc.getTextWidth(endLabel);
        doc.text(endLabel, 120 - endLabelWidth, y - 2);
        
        // Bar
        doc.setFillColor(240, 240, 240);
        doc.rect(20, y, 100, 3, 'F');
        
        // Position marker
        const markerPosition = 20 + ((score - 1) / 4) * 100;
        doc.setFillColor(67, 218, 122); // emerald-500
        doc.circle(markerPosition, y + 1.5, 2, 'F');
        
        doc.setTextColor(0, 0, 0);
        y += 15;
      });

      // Primary Font Recommendation
      y += 10;
      doc.setFontSize(16);
      doc.text('Your Recommended Font', 20, y);
      
      y += 10;
      doc.setFontSize(20);
      const fontName = recommendations.primary.name;
      doc.text(fontName, 20, y);
      
      // Add clickable font link
      const fontLink = recommendations.primary.googleFontsLink;
      doc.setTextColor(0, 100, 200);
      doc.link(20, y - 5, doc.getTextWidth(fontName), 7, { url: fontLink });
      
      y += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text('Selected based on your brand\'s personality', 20, y);

      // Developer Instructions
      y += 20;
      doc.setFontSize(14);
      doc.text('How to Use This Font in Your Website', 20, y);

      // Code blocks with proper wrapping
      y += 10;
      doc.setFontSize(10);
      const embedCode = `<link href="https://fonts.googleapis.com/css2?family=${recommendations.primary.name.replace(/ /g, '+')}:wght@400;500;700&display=swap" rel="stylesheet">`;
      doc.text('Add to your HTML <head>:', 20, y);
      
      y += 7;
      doc.setFillColor(245, 245, 245);
      const codeBlockHeight = 12;
      doc.roundedRect(20, y - 5, 170, codeBlockHeight, 2, 2, 'F');
      
      // Split long code into multiple lines if needed
      const maxWidth = 164; // Slightly less than block width for padding
      let remainingCode = embedCode;
      let lineY = y + 1;
      
      while (remainingCode.length > 0 && lineY < y + codeBlockHeight - 2) {
        let lineEnd = remainingCode.length;
        while (doc.getTextWidth(remainingCode.substring(0, lineEnd)) > maxWidth) {
          lineEnd--;
        }
        
        doc.text(remainingCode.substring(0, lineEnd), 23, lineY);
        remainingCode = remainingCode.substring(lineEnd);
        lineY += 4;
      }

      y += 15;
      doc.text('Use in your CSS:', 20, y);
      
      y += 7;
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(20, y - 5, 170, codeBlockHeight, 2, 2, 'F');
      doc.text(`font-family: '${recommendations.primary.name}', sans-serif;`, 23, y + 1);

      // Call to Action (adjusted to fit within page)
      y = Math.min(y + 30, 250); // Ensure it stays within page bounds
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, 190, y);

      y += 15;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Need help bringing your brand to life?', 20, y);

      y += 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 100, 200);
      doc.text('foundingcreative.com', 20, y);
      doc.link(20, y - 5, 50, 7, { url: 'https://foundingcreative.com' });

      y += 7;
      doc.text('admin@foundingcreative.com', 20, y);
      doc.link(20, y - 5, 70, 7, { url: 'mailto:admin@foundingcreative.com' });

      // Save the PDF
      doc.save(`FontSeek_Report_${recommendations.primary.name.replace(/ /g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
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
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown className="w-4 h-4" />
          {isGeneratingPDF ? 'Generating...' : 'Download PDF Report'}
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