import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

// Default fallback font
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
  
  // Strictly filter fonts to ONLY those matching the primary aesthetic style
  const matchingFonts = fonts.filter(font => font.aestheticStyle === primaryStyle);

  // If we don't have any fonts in this style, use fallback
  if (matchingFonts.length === 0) {
    return {
      primary: fallbackFont,
      secondary: fallbackFont,
      tertiary: fallbackFont,
      aestheticStyle: primaryStyle
    };
  }

  // Calculate distance scores for each matching font
  const fontScores = matchingFonts.map(font => ({
    font,
    distance: calculateDistance(scores, font)
  }));

  // Sort by distance (lower is better)
  fontScores.sort((a, b) => a.distance - b.distance);

  // Get unique fonts (no duplicates)
  const uniqueFonts = getUniqueFonts(fontScores);

  // If we don't have enough fonts, repeat the last one
  while (uniqueFonts.length < 3) {
    uniqueFonts.push(uniqueFonts[uniqueFonts.length - 1] || fallbackFont);
  }

  return {
    primary: uniqueFonts[0],
    secondary: uniqueFonts[1],
    tertiary: uniqueFonts[2],
    aestheticStyle: primaryStyle
  };
}

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let bestScore = -Infinity;

  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    const score = calculateStyleMatchScore(scores, ranges);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = style;
    }
  }

  return bestMatch;
}

function calculateStyleMatchScore(scores: UserScores, ranges: any): number {
  let totalScore = 0;

  // Calculate score for each trait
  const traits = [
    { trait: 'tone', min: ranges.toneMin, max: ranges.toneMax },
    { trait: 'energy', min: ranges.energyMin, max: ranges.energyMax },
    { trait: 'design', min: ranges.designMin, max: ranges.designMax },
    { trait: 'era', min: ranges.eraMin, max: ranges.eraMax },
    { trait: 'structure', min: ranges.structureMin, max: ranges.structureMax }
  ];

  for (const { trait, min, max } of traits) {
    const score = scores[trait as keyof UserScores];
    if (score >= min && score <= max) {
      totalScore += 2; // Bonus for being in range
    } else {
      // Exponential penalty for being outside the range
      const distance = Math.min(Math.abs(score - min), Math.abs(score - max));
      totalScore -= distance * distance;
    }
  }

  return totalScore;
}

function calculateDistance(scores: UserScores, font: FontData): number {
  let totalDistance = 0;
  const traits: (keyof UserScores)[] = ['tone', 'energy', 'design', 'era', 'structure'];

  for (const trait of traits) {
    const diff = Math.abs(scores[trait] - font[trait]);
    // Exponential penalty for larger differences
    totalDistance += diff * diff;
  }

  return totalDistance;
}

function getUniqueFonts(fontScores: { font: FontData; distance: number }[]): FontData[] {
  const uniqueFonts: FontData[] = [];
  const seenNames = new Set<string>();

  for (const { font } of fontScores) {
    if (!seenNames.has(font.name)) {
      uniqueFonts.push(font);
      seenNames.add(font.name);
      if (uniqueFonts.length === 3) break;
    }
  }

  return uniqueFonts;
}