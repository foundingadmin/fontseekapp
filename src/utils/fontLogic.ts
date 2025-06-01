import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

function determineAestheticStyle(scores: UserScores): string {
  // Monospace: structure = 5 AND design ≤ 2
  if (scores.structure === 5 && scores.design <= 2) {
    return 'Monospace';
  }
  
  // Other aesthetic style determinations...
  if (scores.tone <= 2 && scores.energy <= 2 && scores.era <= 2) {
    return 'Serif Old Style';
  }
  
  if (scores.tone <= 2 && scores.era >= 3 && scores.design >= 3) {
    return 'Serif Transitional';
  }
  
  if (scores.structure >= 4 && scores.tone <= 3) {
    return 'Condensed Sans';
  }
  
  const isNeutral = Object.values(scores).every(score => score >= 2 && score <= 4);
  if (isNeutral) {
    return 'Grotesque Sans';
  }
  
  if (scores.structure === 5 && scores.design >= 4) {
    return 'Geometric Sans';
  }
  
  if (scores.tone >= 4 && scores.design === 3 && scores.structure <= 3) {
    return 'Humanist Sans';
  }
  
  if (scores.tone >= 4 && scores.structure <= 3) {
    return 'Rounded Sans';
  }
  
  // Default to Grotesque Sans if no clear match
  return 'Grotesque Sans';
}

function getRandomFonts(aestheticStyle: string): FontData[] {
  // Get all fonts matching the aesthetic style
  const styleFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);
  
  // For Monospace aesthetic, we should always have exactly 3 fonts
  if (aestheticStyle === 'Monospace' && styleFonts.length === 3) {
    return shuffleArray([...styleFonts]);
  }
  
  // If we have exactly 3 fonts, return them in random order
  if (styleFonts.length === 3) {
    return shuffleArray([...styleFonts]);
  }
  
  // If we have more than 3 fonts, return 3 random ones
  if (styleFonts.length > 3) {
    return shuffleArray([...styleFonts]).slice(0, 3);
  }
  
  // If we have fewer than 3 fonts, duplicate the last font to fill the slots
  const result = [...styleFonts];
  while (result.length < 3) {
    result.push(result[result.length - 1]);
  }
  return result;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const [primary, secondary, tertiary] = getRandomFonts(aestheticStyle);
  
  return {
    primary,
    secondary,
    tertiary,
    aestheticStyle
  };
}