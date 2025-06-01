import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

function calculateFontMatchScore(font: FontData, scores: UserScores): number {
  // Calculate how well a font matches the user's preferences
  const traits = ['tone', 'energy', 'design', 'era', 'structure'] as const;
  
  return traits.reduce((score, trait) => {
    // Lower difference means better match
    const difference = Math.abs(font[trait] - scores[trait]);
    // Invert the difference so higher is better, max difference is 5
    return score + (5 - difference);
  }, 0);
}

function getSimilarStyles(aestheticStyle: string, scores: UserScores): string[] {
  // Map of related aesthetic styles
  const styleMap: Record<string, string[]> = {
    'Geometric Sans': ['Humanist Sans', 'Neo-Grotesque'],
    'Humanist Sans': ['Geometric Sans', 'Neo-Grotesque'],
    'Neo-Grotesque': ['Geometric Sans', 'Humanist Sans'],
    'Display / Bubbly': ['Geometric Sans'], // Fallback only if absolutely necessary
    'Serif': ['Humanist Sans', 'Neo-Grotesque'],
  };

  return styleMap[aestheticStyle] || ['Geometric Sans']; // Default fallback
}

function determineAestheticStyle(scores: UserScores): string {
  // Display / Bubbly specific rules
  if (scores.tone <= 2 && scores.energy >= 5 && scores.design >= 5 && scores.era >= 3 && scores.structure >= 3) {
    return 'Display / Bubbly';
  }
  
  if (scores.energy >= 4 && scores.design >= 4 && scores.tone >= 4) {
    return 'Display / Bubbly';
  }

  // Rest of the existing style determination logic...
  if (scores.design >= 4 && scores.energy >= 4 && scores.era <= 3) {
    return 'Geometric Sans';
  }
  
  // ... (rest of the existing conditions)

  return 'Geometric Sans'; // Default fallback
}

function getMatchingFonts(aestheticStyle: string, scores: UserScores): FontData[] {
  // Get fonts matching the aesthetic style
  let matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

  // For Display / Bubbly, we ONLY want fonts from that category
  if (aestheticStyle === 'Display / Bubbly') {
    return matchingFonts.sort((a, b) => calculateFontMatchScore(b, scores) - calculateFontMatchScore(a, scores));
  }

  // For other styles, continue with existing logic...
  if (matchingFonts.length < 3) {
    const similarStyles = getSimilarStyles(aestheticStyle, scores);
    matchingFonts = [
      ...matchingFonts,
      ...fonts.filter(font => 
        similarStyles.includes(font.aestheticStyle) && 
        !matchingFonts.some(f => f.name === font.name)
      )
    ];
  }

  return matchingFonts.sort((a, b) => calculateFontMatchScore(b, scores) - calculateFontMatchScore(a, scores));
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  if (!scores) {
    throw new Error('Scores are required to calculate font recommendations');
  }

  const aestheticStyle = determineAestheticStyle(scores);
  let matchingFonts = getMatchingFonts(aestheticStyle, scores);

  // Ensure we have at least one font to work with
  if (matchingFonts.length === 0) {
    // If no fonts match the aesthetic style, get all fonts and sort by score
    matchingFonts = fonts.sort((a, b) => calculateFontMatchScore(b, scores) - calculateFontMatchScore(a, scores));
  }

  // Get the best matching font as our primary
  const primary = matchingFonts[0];

  // For secondary and tertiary, either use unique fonts if available, or fall back to the primary
  const secondary = matchingFonts[1] || primary;
  const tertiary = matchingFonts[2] || primary;

  return {
    primary,
    secondary,
    tertiary,
    aestheticStyle
  };
}