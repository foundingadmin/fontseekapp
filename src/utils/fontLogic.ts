import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

function determineAestheticStyle(scores: UserScores): string {
  // Serif Old Style: tone ≤ 2, energy ≤ 2, era ≤ 2
  if (scores.tone <= 2 && scores.energy <= 2 && scores.era <= 2) {
    return 'Serif Old Style';
  }
  
  // Serif Transitional: tone ≤ 2, era ≥ 3, design ≥ 3
  if (scores.tone <= 2 && scores.era >= 3 && scores.design >= 3) {
    return 'Serif Transitional';
  }
  
  // Monospace: structure = 5 AND design ≤ 2
  if (scores.structure === 5 && scores.design <= 2) {
    return 'Monospace';
  }
  
  // Condensed Sans: structure ≥ 4 AND tone ≤ 3
  if (scores.structure >= 4 && scores.tone <= 3) {
    return 'Condensed Sans';
  }
  
  // Grotesque Sans: all traits ≈ 3 (±1)
  const isNeutral = Object.values(scores).every(score => score >= 2 && score <= 4);
  if (isNeutral) {
    return 'Grotesque Sans';
  }
  
  // Geometric Sans: structure = 5 AND design ≥ 4
  if (scores.structure === 5 && scores.design >= 4) {
    return 'Geometric Sans';
  }
  
  // Humanist Sans: tone ≥ 4 AND design = 3 AND structure ≤ 3
  if (scores.tone >= 4 && scores.design === 3 && scores.structure <= 3) {
    return 'Humanist Sans';
  }
  
  // Rounded Sans: tone ≥ 4 AND structure ≤ 3
  if (scores.tone >= 4 && scores.structure <= 3) {
    return 'Rounded Sans';
  }
  
  // Neo-Grotesque Sans: tone = 3 AND design = 3 AND structure = 3
  if (scores.tone === 3 && scores.design === 3 && scores.structure === 3) {
    return 'Neo-Grotesque Sans';
  }
  
  // Display / Bubbly: energy ≥ 4 AND design ≥ 4
  if (scores.energy >= 4 && scores.design >= 4) {
    return 'Display / Bubbly';
  }
  
  // Brutalist/Neutral: design = 3 AND tone ≤ 3 AND structure = 3
  if (scores.design === 3 && scores.tone <= 3 && scores.structure === 3) {
    return 'Brutalist/Neutralist';
  }
  
  // Slab Serif: structure = 4 AND design = 3 AND tone ≤ 3
  if (scores.structure === 4 && scores.design === 3 && scores.tone <= 3) {
    return 'Slab Serif';
  }
  
  // Default to Grotesque Sans if no clear match
  return 'Grotesque Sans';
}

function getRandomFonts(aestheticStyle: string): FontData[] {
  const styleFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);
  
  // If we have exactly 3 fonts, return them in random order
  if (styleFonts.length === 3) {
    return shuffleArray([...styleFonts]);
  }
  
  // If we have more than 3 fonts, return 3 random ones
  if (styleFonts.length > 3) {
    return shuffleArray([...styleFonts]).slice(0, 3);
  }
  
  // If we have fewer than 3 fonts, duplicate the last one
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