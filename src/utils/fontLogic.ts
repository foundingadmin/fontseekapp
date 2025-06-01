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

// Keep track of recently used fonts to avoid repetition
const recentlyUsedFonts = new Set<string>();

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  // Calculate scores for all fonts, excluding recently used ones
  const fontScores = fonts
    .filter(font => !recentlyUsedFonts.has(font.name))
    .map(font => ({
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

  // Update recently used fonts
  selectedFonts.forEach(font => {
    if (font) recentlyUsedFonts.add(font.name);
  });

  // Keep only the last 9 fonts (3 sets) in memory
  if (recentlyUsedFonts.size > 9) {
    const oldestFonts = Array.from(recentlyUsedFonts).slice(0, recentlyUsedFonts.size - 9);
    oldestFonts.forEach(font => recentlyUsedFonts.delete(font));
  }

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

  // Calculate how well each trait matches the style's range
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

  // First, try to get fonts with different aesthetic styles
  for (const { font } of fontScores) {
    if (selected.length === 3) break;

    // Skip if we already have this style (unless we're desperate)
    if (usedStyles.has(font.aestheticStyle) && usedStyles.size < fontScores.length) continue;

    // Skip if we already have this font
    if (selected.some(f => f.name === font.name)) continue;

    selected.push(font);
    usedStyles.add(font.aestheticStyle);
  }

  // If we still need more fonts, fill with best remaining matches
  while (selected.length < 3 && fontScores.length > selected.length) {
    const nextBest = fontScores.find(({ font }) => 
      !selected.some(f => f.name === font.name)
    );
    if (nextBest) {
      selected.push(nextBest.font);
    } else {
      break;
    }
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