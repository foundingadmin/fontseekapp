import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

// Default fallback font to use when no matches are found
const fallbackFont: FontData = {
  name: 'System UI',
  family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  aestheticStyle: 'Modern Sans',
  tone: 5,
  energy: 5,
  design: 5,
  era: 5,
  structure: 5,
  category: 'sans-serif',
  weight: 400,
  googleFontsLink: '',
  embedCode: '',
  personalityTags: [],
  recommendedFor: []
};

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  // First, determine the aesthetic style based on the user's scores
  const matchingStyle = determineAestheticStyle(scores);
  
  // Filter fonts by the matching aesthetic style
  const matchingFonts = fonts.filter(font => font.aestheticStyle === matchingStyle);
  
  // Calculate distance scores for each matching font
  const fontScores = matchingFonts.map(font => ({
    font,
    distance: calculateDistance(scores, font)
  }));
  
  // Sort by distance (lower is better)
  fontScores.sort((a, b) => a.distance - b.distance);

  // Get primary font or fall back to default
  const primary = fontScores[0]?.font || fallbackFont;
  
  // Get secondary font or fall back to primary
  const secondary = fontScores[1]?.font || primary;
  
  // Get tertiary font or fall back to secondary
  const tertiary = fontScores[2]?.font || secondary;
  
  return {
    primary,
    secondary,
    tertiary,
    aestheticStyle: matchingStyle
  };
}

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let smallestDeviation = Infinity;
  
  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    const deviation = calculateStyleDeviation(scores, ranges);
    if (deviation < smallestDeviation) {
      smallestDeviation = deviation;
      bestMatch = style;
    }
  }
  
  return bestMatch;
}

function calculateStyleDeviation(scores: UserScores, ranges: any): number {
  let totalDeviation = 0;
  
  // Check if score falls within min/max range for each trait
  totalDeviation += getDeviationForTrait(scores.tone, ranges.toneMin, ranges.toneMax);
  totalDeviation += getDeviationForTrait(scores.energy, ranges.energyMin, ranges.energyMax);
  totalDeviation += getDeviationForTrait(scores.design, ranges.designMin, ranges.designMax);
  totalDeviation += getDeviationForTrait(scores.era, ranges.eraMin, ranges.eraMax);
  totalDeviation += getDeviationForTrait(scores.structure, ranges.structureMin, ranges.structureMax);
  
  return totalDeviation;
}

function getDeviationForTrait(score: number, min: number, max: number): number {
  if (score < min) return min - score;
  if (score > max) return score - max;
  return 0;
}

function calculateDistance(scores: UserScores, font: FontData): number {
  return Math.abs(scores.tone - font.tone) +
         Math.abs(scores.energy - font.energy) +
         Math.abs(scores.design - font.design) +
         Math.abs(scores.era - font.era) +
         Math.abs(scores.structure - font.structure);
}