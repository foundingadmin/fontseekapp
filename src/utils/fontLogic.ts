import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

function determineAestheticStyle(scores: UserScores): string {
  const { tone, energy, design, era, structure } = scores;

  // Display / Bubbly
  // High energy, expressive designs with casual tone
  if (tone >= 4 && energy >= 4 && design >= 4) {
    return 'Display / Bubbly';
  }

  // Geometric Sans
  // Modern, structured, minimal designs
  if (structure >= 4 && era >= 4 && design <= 3) {
    return 'Geometric Sans';
  }

  // Grotesque Sans
  // Professional, neutral designs with good structure
  if (tone <= 3 && structure >= 3 && design <= 3) {
    return 'Grotesque Sans';
  }

  // Humanist Sans
  // Friendly, balanced designs with organic structure
  if (tone >= 3 && structure <= 3 && energy <= 4) {
    return 'Humanist Sans';
  }

  // Rounded Sans
  // Approachable, modern designs with organic structure
  if (tone >= 3 && structure <= 2 && energy >= 3) {
    return 'Rounded Sans';
  }

  // Monospace
  // Technical, structured designs
  if (structure >= 4 && design <= 3 && era >= 4) {
    return 'Monospace';
  }

  // Modern Serif
  // Contemporary, expressive serif designs
  if (era >= 4 && design >= 4 && tone >= 3) {
    return 'Modern Serif';
  }

  // Transitional Serif
  // Balanced, traditional serif designs
  if (era === 3 && design >= 2 && design <= 4) {
    return 'Transitional Serif';
  }

  // Old Style Serif
  // Classic, formal serif designs
  if (tone <= 2 && era <= 2) {
    return 'Serif Old Style';
  }

  // Default to Humanist Sans if no clear match
  return 'Humanist Sans';
}

function calculateFontMatchScore(font: FontData, scores: UserScores): number {
  const traits = ['tone', 'energy', 'design', 'era', 'structure'] as const;
  
  return traits.reduce((score, trait) => {
    const difference = Math.abs(font[trait] - scores[trait]);
    return score + (5 - difference);
  }, 0);
}

function getFallbackFonts(scores: UserScores, usedFonts: Set<string>): FontData[] {
  // Get fonts from similar aesthetic styles based on scores
  const { tone, energy, design, era, structure } = scores;
  
  let fallbackStyles: string[] = [];
  
  if (tone >= 4 && energy >= 3) {
    fallbackStyles.push('Display / Bubbly', 'Rounded Sans');
  } else if (structure >= 4 && era >= 4) {
    fallbackStyles.push('Geometric Sans', 'Monospace');
  } else if (tone <= 2 && era <= 3) {
    fallbackStyles.push('Transitional Serif', 'Serif Old Style');
  } else {
    fallbackStyles.push('Humanist Sans', 'Grotesque Sans');
  }

  return fonts
    .filter(font => 
      fallbackStyles.includes(font.aestheticStyle) && 
      !usedFonts.has(font.name)
    )
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