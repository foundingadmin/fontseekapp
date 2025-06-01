import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

function determineAestheticStyle(scores: UserScores): string {
  // Apply the new scoring rules in order of priority
  if (scores.design >= 4 && scores.energy >= 4 && scores.era <= 3) {
    return 'Geometric Sans';
  }
  
  if (scores.design >= 4 && scores.energy <= 3 && scores.era >= 4) {
    return 'Modern Serif';
  }
  
  if (scores.design <= 3 && scores.era <= 3 && scores.structure <= 3 && scores.tone <= 3) {
    return 'Monospace';
  }
  
  if (scores.era >= 4 && scores.design >= 3 && scores.tone >= 3) {
    return 'Classic Serif';
  }
  
  if (scores.design === 3 && Object.values(scores).every(score => score === 3)) {
    return 'Grotesque Sans';
  }
  
  if (scores.tone >= 4 && scores.era <= 3) {
    return 'Humanist Sans';
  }
  
  if (scores.energy === 5 && scores.design === 5 && scores.tone === 5) {
    return 'Display';
  }

  // If no perfect match, find best match based on trait values
  const styleCounts = new Map<string, number>();
  
  for (const font of fonts) {
    let matchingTraits = 0;
    if (Math.abs(font.tone - scores.tone) <= 1) matchingTraits++;
    if (Math.abs(font.energy - scores.energy) <= 1) matchingTraits++;
    if (Math.abs(font.design - scores.design) <= 1) matchingTraits++;
    if (Math.abs(font.era - scores.era) <= 1) matchingTraits++;
    if (Math.abs(font.structure - scores.structure) <= 1) matchingTraits++;
    
    if (matchingTraits >= 3) {
      const count = styleCounts.get(font.aestheticStyle) || 0;
      styleCounts.set(font.aestheticStyle, count + 1);
    }
  }

  // Return the style with the most matching fonts
  let bestStyle = '';
  let maxCount = 0;
  
  for (const [style, count] of styleCounts) {
    if (count > maxCount) {
      maxCount = count;
      bestStyle = style;
    }
  }

  return bestStyle || 'Modern Serif'; // Fallback to Modern Serif if no clear match
}

function getMatchingFonts(aestheticStyle: string, scores: UserScores): FontData[] {
  const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

  if (matchingFonts.length === 0) {
    return fonts.filter(font => font.aestheticStyle === 'Modern Serif');
  }

  // Sort fonts by how well they match the scores
  return matchingFonts.sort((a, b) => {
    const aScore = calculateFontMatchScore(a, scores);
    const bScore = calculateFontMatchScore(b, scores);
    return bScore - aScore;
  });
}

function calculateFontMatchScore(font: FontData, scores: UserScores): number {
  let totalScore = 0;
  const weights = {
    tone: 1.5,
    energy: 1.5,
    design: 2,
    era: 2,
    structure: 1.5
  };

  for (const trait of Object.keys(scores) as Array<keyof UserScores>) {
    const diff = Math.abs(font[trait] - scores[trait]);
    totalScore += (4 - diff) * weights[trait];
  }

  return totalScore;
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const matchingFonts = getMatchingFonts(aestheticStyle, scores);

  // Ensure we have enough fonts by falling back to Modern Serif if needed
  if (matchingFonts.length < 3) {
    const modernSerifFonts = fonts.filter(font => font.aestheticStyle === 'Modern Serif');
    const availableFonts = [...matchingFonts, ...modernSerifFonts];
    
    return {
      primary: availableFonts[0],
      secondary: availableFonts[1] || availableFonts[0],
      tertiary: availableFonts[2] || availableFonts[1],
      aestheticStyle
    };
  }

  // Return three unique fonts
  return {
    primary: matchingFonts[0],
    secondary: matchingFonts[1],
    tertiary: matchingFonts[2],
    aestheticStyle
  };
}