import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

function isDisplayBubblyEligible(scores: UserScores): boolean {
  return scores.tone >= 3 && 
         scores.structure >= 3 && 
         scores.energy >= 4 &&
         scores.design >= 4;
}

function determineAestheticStyle(scores: UserScores): string {
  const { tone, energy, design, era, structure } = scores;

  // Display / Bubbly - Strict eligibility check
  if (isDisplayBubblyEligible(scores)) {
    return 'Display / Bubbly';
  }

  // Geometric Sans - Modern, structured, minimal
  if (structure >= 4 && era >= 4 && design <= 3) {
    return 'Geometric Sans';
  }

  // Transitional Serif - Traditional, balanced
  if (tone <= 3 && era <= 3 && structure <= 3) {
    return 'Transitional Serif';
  }

  // Humanist Sans - Friendly, balanced
  if (tone >= 3 && structure <= 3) {
    return 'Humanist Sans';
  }

  // Default to Humanist Sans if no clear match
  return 'Humanist Sans';
}

function calculateFontMatchScore(font: FontData, scores: UserScores): number {
  const weights = {
    tone: 2.0,      // Higher weight for tone
    energy: 1.5,    // Medium-high weight for energy
    design: 1.5,    // Medium-high weight for design
    era: 1.0,       // Standard weight for era
    structure: 1.0  // Standard weight for structure
  };

  let score = 0;
  let totalWeight = 0;

  for (const [trait, weight] of Object.entries(weights)) {
    const traitKey = trait as keyof typeof weights;
    const difference = Math.abs(font[traitKey] - scores[traitKey]);
    score += (5 - difference) * weight;
    totalWeight += weight;
  }

  // Normalize score to 0-100 range
  const normalizedScore = (score / (5 * totalWeight)) * 100;

  // Apply penalties for Display/Bubbly fonts when inappropriate
  if (font.aestheticStyle === 'Display / Bubbly' && !isDisplayBubblyEligible(scores)) {
    return 0; // Completely exclude ineligible display fonts
  }

  return normalizedScore;
}

function getFallbackFonts(scores: UserScores, usedFonts: Set<string>): FontData[] {
  // Get fonts from similar aesthetic styles based on scores
  const fallbackStyles = new Set<string>();
  
  if (scores.tone <= 3 && scores.era <= 3) {
    fallbackStyles.add('Transitional Serif');
  }
  if (scores.structure >= 4 && scores.era >= 4) {
    fallbackStyles.add('Geometric Sans');
  }
  if (scores.tone >= 3 && scores.structure <= 3) {
    fallbackStyles.add('Humanist Sans');
  }

  return fonts
    .filter(font => 
      fallbackStyles.has(font.aestheticStyle) && 
      !usedFonts.has(font.name) &&
      // Additional validation for Display/Bubbly fonts
      !(font.aestheticStyle === 'Display / Bubbly' && !isDisplayBubblyEligible(scores))
    )
    .sort((a, b) => calculateFontMatchScore(b, scores) - calculateFontMatchScore(a, scores));
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const usedFonts = new Set<string>();

  // Get fonts matching the primary aesthetic style
  let matchingFonts = fonts
    .filter(font => {
      if (font.aestheticStyle === 'Display / Bubbly' && !isDisplayBubblyEligible(scores)) {
        return false;
      }
      return font.aestheticStyle === aestheticStyle;
    })
    .sort((a, b) => calculateFontMatchScore(b, scores) - calculateFontMatchScore(a, scores));

  // Select primary font
  const primary = matchingFonts[0];
  if (primary) {
    usedFonts.add(primary.name);
  }

  // Select secondary font
  let secondary = matchingFonts.find(font => !usedFonts.has(font.name));
  if (!secondary) {
    const fallbackFonts = getFallbackFonts(scores, usedFonts);
    secondary = fallbackFonts[0];
  }
  if (secondary) {
    usedFonts.add(secondary.name);
  }

  // Select tertiary font
  let tertiary = matchingFonts.find(font => !usedFonts.has(font.name));
  if (!tertiary) {
    const fallbackFonts = getFallbackFonts(scores, usedFonts);
    tertiary = fallbackFonts[0];
  }

  return {
    primary: primary || fonts[0],
    secondary: secondary || fonts[1],
    tertiary: tertiary || fonts[2],
    aestheticStyle
  };
}