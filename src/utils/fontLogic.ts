import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

function calculateFontMatchScore(font: FontData, scores: UserScores): number {
  const traits = ['tone', 'energy', 'design', 'era', 'structure'] as const;
  
  return traits.reduce((score, trait) => {
    const difference = Math.abs(font[trait] - scores[trait]);
    return score + (5 - difference);
  }, 0);
}

function getStyleMatchScore(scores: UserScores, style: string): number {
  const ranges = aestheticScoring[style];
  if (!ranges) return 0;

  let score = 0;
  
  // Check each trait against the style's ranges
  if (scores.tone >= ranges.toneMin && scores.tone <= ranges.toneMax) score++;
  if (scores.energy >= ranges.energyMin && scores.energy <= ranges.energyMax) score++;
  if (scores.design >= ranges.designMin && scores.design <= ranges.designMax) score++;
  if (scores.era >= ranges.eraMin && scores.era <= ranges.eraMax) score++;
  if (scores.structure >= ranges.structureMin && scores.structure <= ranges.structureMax) score++;

  return score;
}

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let highestScore = -1;

  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    const score = getStyleMatchScore(scores, style);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = style;
    }
  }

  return bestMatch;
}

function getFallbackFonts(scores: UserScores, usedFonts: Set<string>): FontData[] {
  return fonts
    .filter(font => !usedFonts.has(font.name))
    .sort((a, b) => calculateFontMatchScore(b, scores) - calculateFontMatchScore(a, scores));
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const usedFonts = new Set<string>();

  // Get fonts matching the primary aesthetic style
  let matchingFonts = fonts
    .filter(font => font.aestheticStyle === aestheticStyle)
    .sort((a, b) => calculateFontMatchScore(b, scores) - calculateFontMatchScore(a, scores));

  // Select primary font
  const primary = matchingFonts[0] || fonts[0];
  usedFonts.add(primary.name);

  // Select secondary font
  let secondary = matchingFonts.find(font => !usedFonts.has(font.name));
  if (!secondary) {
    const fallbackFonts = getFallbackFonts(scores, usedFonts);
    secondary = fallbackFonts[0] || primary;
  }
  usedFonts.add(secondary.name);

  // Select tertiary font
  let tertiary = matchingFonts.find(font => !usedFonts.has(font.name));
  if (!tertiary) {
    const fallbackFonts = getFallbackFonts(scores, usedFonts);
    tertiary = fallbackFonts[0] || secondary;
  }
  usedFonts.add(tertiary.name);

  return {
    primary,
    secondary,
    tertiary,
    aestheticStyle
  };
}