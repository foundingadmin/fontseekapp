import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

// Default fallback font to use when no matches are found
const fallbackFont: FontData = {
  name: 'System UI',
  googleFontsLink: '',
  tone: 3,
  energy: 3,
  design: 3,
  era: 3,
  structure: 3,
  aestheticStyle: 'System Default',
  embedCode: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  personalityTags: ['Clean', 'Universal', 'Reliable'],
  recommendedFor: ['Any Context']
};

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  // Calculate scores for all fonts
  const fontScores = fonts.map(font => ({
    font,
    styleMatch: calculateStyleMatch(scores, font.aestheticStyle),
    traitScore: calculateTraitScore(scores, font)
  }));

  // Sort by combined score (style match + trait score)
  fontScores.sort((a, b) => {
    const totalScoreA = a.styleMatch + a.traitScore;
    const totalScoreB = b.styleMatch + b.traitScore;
    return totalScoreB - totalScoreA;
  });

  // Select fonts ensuring diversity in aesthetic styles
  const selectedFonts = selectDiverseFonts(fontScores);

  return {
    primary: selectedFonts[0] || fallbackFont,
    secondary: selectedFonts[1] || selectedFonts[0] || fallbackFont,
    tertiary: selectedFonts[2] || selectedFonts[1] || fallbackFont,
    aestheticStyle: determineOverallStyle(selectedFonts[0]?.aestheticStyle || '', scores)
  };
}

function calculateStyleMatch(scores: UserScores, fontStyle: string): number {
  const styleRanges = aestheticScoring[fontStyle];
  if (!styleRanges) return 0;

  const matches = [
    isInRange(scores.tone, styleRanges.toneMin, styleRanges.toneMax),
    isInRange(scores.energy, styleRanges.energyMin, styleRanges.energyMax),
    isInRange(scores.design, styleRanges.designMin, styleRanges.designMax),
    isInRange(scores.era, styleRanges.eraMin, styleRanges.eraMax),
    isInRange(scores.structure, styleRanges.structureMin, styleRanges.structureMax)
  ];

  return matches.filter(Boolean).length;
}

function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function calculateTraitScore(scores: UserScores, font: FontData): number {
  const weights = {
    tone: 2.0,     // Highest weight - crucial for brand voice
    energy: 1.8,   // Very important for personality
    design: 1.5,   // Important for visual impact
    era: 1.2,      // Less critical but still relevant
    structure: 1.0 // Base weight for structural aspects
  };

  const getTraitScore = (userScore: number, fontScore: number): number => {
    const diff = Math.abs(userScore - fontScore);
    return Math.max(5 - diff, 0); // 5 is max score, decreases with difference
  };

  return (
    getTraitScore(scores.tone, font.tone) * weights.tone +
    getTraitScore(scores.energy, font.energy) * weights.energy +
    getTraitScore(scores.design, font.design) * weights.design +
    getTraitScore(scores.era, font.era) * weights.era +
    getTraitScore(scores.structure, font.structure) * weights.structure
  );
}

function selectDiverseFonts(fontScores: { font: FontData; styleMatch: number; traitScore: number }[]): FontData[] {
  const selected: FontData[] = [];
  const usedStyles = new Set<string>();

  for (const { font } of fontScores) {
    // For the first font, just take the best match
    if (selected.length === 0) {
      selected.push(font);
      usedStyles.add(font.aestheticStyle);
      continue;
    }

    // For subsequent fonts, ensure different aesthetic style if possible
    if (!usedStyles.has(font.aestheticStyle) || usedStyles.size >= 3) {
      if (selected.every(selectedFont => selectedFont.name !== font.name)) {
        selected.push(font);
        usedStyles.add(font.aestheticStyle);
      }
    }

    if (selected.length === 3) break;
  }

  return selected;
}

function determineOverallStyle(primaryStyle: string, scores: UserScores): string {
  // If we have a valid primary style, use it
  if (primaryStyle && primaryStyle !== 'System Default') {
    return primaryStyle;
  }

  // Otherwise, determine style based on scores
  const styleScores = Object.entries(aestheticScoring).map(([style, ranges]) => ({
    style,
    match: calculateStyleMatch(scores, style)
  }));

  styleScores.sort((a, b) => b.match - a.match);
  return styleScores[0]?.style || 'Geometric Sans'; // Fallback to Geometric Sans if no match
}