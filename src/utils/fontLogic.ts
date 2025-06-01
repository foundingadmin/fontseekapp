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
  // First, determine the aesthetic style based on trait ranges
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

  // Calculate weighted distance scores for each matching font
  const fontScores = matchingFonts.map(font => ({
    font,
    distance: calculateWeightedDistance(scores, font, primaryStyle)
  }));

  // Sort by distance (lower is better)
  fontScores.sort((a, b) => a.distance - b.distance);

  // Get unique fonts (no duplicates)
  const uniqueFonts = getUniqueFonts(fontScores);

  // If we don't have enough fonts, use fallback
  while (uniqueFonts.length < 3) {
    uniqueFonts.push(fallbackFont);
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
  let highestScore = -Infinity;

  // Calculate match score for each aesthetic style
  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    const score = calculateStyleMatchScore(scores, ranges);
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = style;
    }
  }

  return bestMatch;
}

function calculateStyleMatchScore(scores: UserScores, ranges: AestheticRange): number {
  let score = 0;
  const traits: Array<keyof UserScores> = ['tone', 'energy', 'design', 'era', 'structure'];

  for (const trait of traits) {
    const userScore = scores[trait];
    const min = ranges[`${trait}Min`];
    const max = ranges[`${trait}Max`];

    // Perfect match within range
    if (userScore >= min && userScore <= max) {
      score += 10;
    } else {
      // Penalty for being outside range
      const distance = Math.min(
        Math.abs(userScore - min),
        Math.abs(userScore - max)
      );
      score -= distance * distance;
    }
  }

  return score;
}

function calculateWeightedDistance(scores: UserScores, font: FontData, style: string): number {
  let distance = 0;
  const weights = getTraitWeights(style);

  for (const [trait, weight] of Object.entries(weights)) {
    const diff = Math.abs(scores[trait as keyof UserScores] - font[trait as keyof FontData]);
    distance += diff * diff * weight;
  }

  return distance;
}

function getTraitWeights(style: string): Record<keyof UserScores, number> {
  // Default weights
  const weights = {
    tone: 1,
    energy: 1,
    design: 1,
    era: 1,
    structure: 1
  };

  // Apply style-specific weight adjustments
  switch (style) {
    case 'Monospace':
      weights.structure = 1.5;
      weights.era = 1.25;
      break;
    case 'Rounded Sans':
      weights.tone = 1.5;
      weights.energy = 1.25;
      break;
    case 'Geometric Sans':
      weights.design = 1.5;
      weights.structure = 1.25;
      break;
    case 'Serif Old Style':
      weights.tone = 1.5;
      weights.era = 1.25;
      break;
    case 'Display / Bubbly':
      weights.energy = 1.5;
      weights.design = 1.25;
      break;
  }

  return weights;
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