import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

function determineAestheticStyle(scores: UserScores): string {
  // Display / Bubbly: high energy, design, and tone with low structure
  if (scores.energy >= 4 && scores.design >= 4 && scores.tone >= 4 && scores.structure <= 2) {
    return 'Display / Bubbly';
  }
  
  // Monospace: high structure and low design
  if (scores.structure === 5 && scores.design <= 2) {
    return 'Monospace';
  }
  
  // Other aesthetic style determinations...
  if (scores.tone <= 2 && scores.energy <= 2 && scores.era <= 2) {
    return 'Classic Serif';
  }
  
  if (scores.tone <= 2 && scores.era >= 3 && scores.design >= 3) {
    return 'Transitional Serif';
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
  
  // Default to Grotesque Sans if no clear match
  return 'Grotesque Sans';
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getRandomFonts(aestheticStyle: string): FontData[] {
  // Get all fonts matching the aesthetic style
  const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);
  
  if (matchingFonts.length === 0) {
    throw new Error(`No fonts found for aesthetic style: ${aestheticStyle}`);
  }
  
  // If we have exactly 3 fonts, shuffle them
  if (matchingFonts.length === 3) {
    return shuffleArray([...matchingFonts]);
  }
  
  // If we have more than 3 fonts, return 3 random ones
  if (matchingFonts.length > 3) {
    return shuffleArray([...matchingFonts]).slice(0, 3);
  }
  
  // If we have fewer than 3 fonts, fill with alternatives from similar styles
  const result = [...matchingFonts];
  const remainingCount = 3 - result.length;
  
  if (remainingCount > 0) {
    const otherFonts = fonts.filter(font => 
      font.aestheticStyle !== aestheticStyle &&
      !result.includes(font)
    );
    
    const alternatives = shuffleArray(otherFonts).slice(0, remainingCount);
    result.push(...alternatives);
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