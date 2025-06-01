import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

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

// ... (rest of the existing functions)

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  if (!scores) {
    throw new Error('Scores are required to calculate font recommendations');
  }

  const aestheticStyle = determineAestheticStyle(scores);
  let matchingFonts = getMatchingFonts(aestheticStyle, scores);

  // Ensure we have exactly three unique fonts
  const uniqueFonts = Array.from(new Set(matchingFonts.map(font => font.name)))
    .map(name => matchingFonts.find(font => font.name === name)!)
    .slice(0, 3);

  // For Display / Bubbly, if we don't have enough fonts, cycle through the available ones
  if (aestheticStyle === 'Display / Bubbly' && uniqueFonts.length < 3) {
    while (uniqueFonts.length < 3) {
      uniqueFonts.push(uniqueFonts[0]);
    }
  }

  return {
    primary: uniqueFonts[0],
    secondary: uniqueFonts[1],
    tertiary: uniqueFonts[2],
    aestheticStyle
  };
}