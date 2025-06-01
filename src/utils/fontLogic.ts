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

  // If no clear match found, determine based on dominant traits
  if (!bestStyle) {
    if (scores.design >= 4 && scores.era >= 4) {
      return 'Modern Serif';
    }
    if (scores.tone <= 2 && scores.era <= 2) {
      return 'Serif Old Style';
    }
    if (scores.energy >= 4 && scores.design >= 4) {
      return 'Display / Bubbly';
    }
    return 'Transitional Serif'; // Final fallback
  }

  return bestStyle;
}

function getMatchingFonts(aestheticStyle: string, scores: UserScores): FontData[] {
  // Get fonts matching the primary aesthetic style
  let matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

  // If we don't have enough fonts, get fonts from similar styles
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

  // Sort fonts by how well they match the scores
  return matchingFonts.sort((a, b) => {
    const aScore = calculateFontMatchScore(a, scores);
    const bScore = calculateFontMatchScore(b, scores);
    return bScore - aScore;
  });
}

function getSimilarStyles(primaryStyle: string, scores: UserScores): string[] {
  const styleGroups = {
    'serif': ['Serif Old Style', 'Transitional Serif', 'Modern Serif'],
    'sans': ['Geometric Sans', 'Grotesque Sans', 'Humanist Sans'],
    'display': ['Display / Bubbly', 'Rounded Sans'],
    'technical': ['Monospace']
  };

  // Find the group containing the primary style
  const group = Object.values(styleGroups).find(g => g.includes(primaryStyle)) || [];
  
  // Return other styles from the same group
  return group.filter(style => style !== primaryStyle);
}

function calculateFontMatchScore(font: FontData, scores: UserScores): number {
  const weights = {
    tone: 1.5,
    energy: 1.5,
    design: 2.0,
    era: 2.0,
    structure: 1.5
  };

  return Object.entries(scores).reduce((score, [trait, value]) => {
    const traitKey = trait as keyof UserScores;
    const diff = Math.abs(font[traitKey] - value);
    return score + (5 - diff) * weights[traitKey];
  }, 0);
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  if (!scores) {
    throw new Error('Scores are required to calculate font recommendations');
  }

  const aestheticStyle = determineAestheticStyle(scores);
  let matchingFonts = getMatchingFonts(aestheticStyle, scores);

  // If we don't have enough fonts, get additional recommendations
  if (matchingFonts.length < 3) {
    const additionalFonts = fonts
      .filter(font => !matchingFonts.some(f => f.name === font.name))
      .sort((a, b) => calculateFontMatchScore(b, scores) - calculateFontMatchScore(a, scores))
      .slice(0, 3 - matchingFonts.length);

    matchingFonts = [...matchingFonts, ...additionalFonts];
  }

  // Ensure we have exactly three unique fonts
  const uniqueFonts = Array.from(new Set(matchingFonts.map(font => font.name)))
    .map(name => matchingFonts.find(font => font.name === name)!)
    .slice(0, 3);

  // If we somehow still don't have enough fonts, duplicate the best matches
  while (uniqueFonts.length < 3) {
    uniqueFonts.push(uniqueFonts[0]);
  }

  return {
    primary: uniqueFonts[0],
    secondary: uniqueFonts[1],
    tertiary: uniqueFonts[2],
    aestheticStyle
  };
}