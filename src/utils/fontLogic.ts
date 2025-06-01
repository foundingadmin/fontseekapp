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
  const matchingStyle = determineAestheticStyle(scores);
  
  // Get fonts matching the primary aesthetic style
  let matchingFonts = fonts.filter(font => font.aestheticStyle === matchingStyle);
  
  // If we don't have enough fonts in the primary style, get fonts from similar styles
  if (matchingFonts.length < 3) {
    const similarStyles = getSimilarStyles(matchingStyle, scores);
    matchingFonts = [
      ...matchingFonts,
      ...fonts.filter(font => 
        similarStyles.includes(font.aestheticStyle) && 
        !matchingFonts.some(f => f.name === font.name)
      )
    ];
  }

  // Calculate distance scores for each matching font
  const fontScores = matchingFonts.map(font => ({
    font,
    distance: calculateDistance(scores, font)
  }));

  // Sort by distance (lower is better)
  fontScores.sort((a, b) => a.distance - b.distance);

  // Get unique fonts by selecting the best scoring fonts with different names
  const uniqueFonts = getUniqueFonts(fontScores);

  return {
    primary: uniqueFonts[0] || fallbackFont,
    secondary: uniqueFonts[1] || uniqueFonts[0] || fallbackFont,
    tertiary: uniqueFonts[2] || uniqueFonts[1] || fallbackFont,
    aestheticStyle: matchingStyle
  };
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

function getSimilarStyles(primaryStyle: string, scores: UserScores): string[] {
  // Calculate style match scores for all styles
  const styleScores = Object.entries(aestheticScoring).map(([style, ranges]) => ({
    style,
    deviation: calculateStyleDeviation(scores, ranges)
  }));

  // Sort by deviation (lower is better) and filter out the primary style
  return styleScores
    .filter(score => score.style !== primaryStyle)
    .sort((a, b) => a.deviation - b.deviation)
    .slice(0, 2) // Get top 2 similar styles
    .map(score => score.style);
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