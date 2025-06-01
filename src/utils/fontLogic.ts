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
  // First, determine the aesthetic style based on the user's scores
  const primaryStyle = determineAestheticStyle(scores);
  
  // Strictly filter fonts to only those matching the primary style
  let matchingFonts = fonts.filter(font => font.aestheticStyle === primaryStyle);

  // If we don't have enough fonts in the primary style (minimum 3),
  // find the next best matching style and include its fonts
  if (matchingFonts.length < 3) {
    const nextBestStyle = findNextBestStyle(scores, primaryStyle);
    const additionalFonts = fonts.filter(font => font.aestheticStyle === nextBestStyle);
    matchingFonts = [...matchingFonts, ...additionalFonts];
  }

  // Calculate match scores for each font
  const fontScores = matchingFonts.map(font => ({
    font,
    score: calculateFontMatchScore(scores, font)
  }));

  // Sort by match score (higher is better)
  fontScores.sort((a, b) => b.score - a.score);

  // Get top 3 unique fonts
  const selectedFonts = getTopUniqueFonts(fontScores, 3);

  return {
    primary: selectedFonts[0] || fallbackFont,
    secondary: selectedFonts[1] || selectedFonts[0] || fallbackFont,
    tertiary: selectedFonts[2] || selectedFonts[1] || fallbackFont,
    aestheticStyle: primaryStyle
  };
}

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let highestScore = -1;

  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    const score = calculateStyleMatchScore(scores, ranges);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = style;
    }
  }

  return bestMatch;
}

function calculateStyleMatchScore(scores: UserScores, ranges: any): number {
  const traits = [
    { score: scores.tone, min: ranges.toneMin, max: ranges.toneMax, weight: 1.2 },
    { score: scores.energy, min: ranges.energyMin, max: ranges.energyMax, weight: 1.0 },
    { score: scores.design, min: ranges.designMin, max: ranges.designMax, weight: 1.1 },
    { score: scores.era, min: ranges.eraMin, max: ranges.eraMax, weight: 0.9 },
    { score: scores.structure, min: ranges.structureMin, max: ranges.structureMax, weight: 0.8 }
  ];

  return traits.reduce((total, trait) => {
    if (trait.score >= trait.min && trait.score <= trait.max) {
      return total + (1 * trait.weight);
    }
    const distanceToRange = Math.min(
      Math.abs(trait.score - trait.min),
      Math.abs(trait.score - trait.max)
    );
    return total - (distanceToRange * trait.weight);
  }, 0);
}

function findNextBestStyle(scores: UserScores, currentStyle: string): string {
  const styleScores = Object.entries(aestheticScoring)
    .filter(([style]) => style !== currentStyle)
    .map(([style, ranges]) => ({
      style,
      score: calculateStyleMatchScore(scores, ranges)
    }));

  styleScores.sort((a, b) => b.score - a.score);
  return styleScores[0]?.style || currentStyle;
}

function calculateFontMatchScore(scores: UserScores, font: FontData): number {
  const weights = {
    tone: 2.5,     // Most important for brand voice
    energy: 2.0,   // Very important for personality
    design: 1.8,   // Important for visual style
    era: 1.5,      // Moderately important
    structure: 1.2 // Still relevant but less critical
  };

  const traitScore = (userScore: number, fontScore: number): number => {
    const diff = Math.abs(userScore - fontScore);
    return 5 - diff; // Perfect match = 5, worst match = 0
  };

  return (
    traitScore(scores.tone, font.tone) * weights.tone +
    traitScore(scores.energy, font.energy) * weights.energy +
    traitScore(scores.design, font.design) * weights.design +
    traitScore(scores.era, font.era) * weights.era +
    traitScore(scores.structure, font.structure) * weights.structure
  );
}

function getTopUniqueFonts(fontScores: { font: FontData; score: number }[], count: number): FontData[] {
  const uniqueFonts: FontData[] = [];
  const seenStyles = new Set<string>();

  for (const { font } of fontScores) {
    if (!seenStyles.has(font.aestheticStyle)) {
      uniqueFonts.push(font);
      seenStyles.add(font.aestheticStyle);
      if (uniqueFonts.length === count) break;
    }
  }

  return uniqueFonts;
}