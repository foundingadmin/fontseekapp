import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

// Default fallback font to use when no matches are found
const fallbackFont: FontData = {
  name: 'System UI',
  googleFontsLink: '',
  tone: 3,
  energy: 3,
  design: 3,
  era: 3,
  structure: 3,
  aestheticStyle: 'System Default',
  embedCode: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  personalityTags: ['Clean', 'Universal', 'Reliable'],
  recommendedFor: ['Any Context']
};

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let bestMatchScore = -1;

  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    let matchScore = 0;
    let isValid = true;

    // Check each trait against its range
    const traits: Array<keyof UserScores> = ['tone', 'energy', 'design', 'era', 'structure'];
    
    for (const trait of traits) {
      const score = scores[trait];
      const min = ranges[`${trait}Min`];
      const max = ranges[`${trait}Max`];

      if (score < min || score > max) {
        isValid = false;
        break;
      }

      // Calculate how well this score fits within the range
      const rangeCenter = (min + max) / 2;
      const distance = Math.abs(score - rangeCenter);
      matchScore += 1 - (distance / 4); // Higher score for closer matches
    }

    if (isValid && matchScore > bestMatchScore) {
      bestMatch = style;
      bestMatchScore = matchScore;
    }
  }

  // Special case for Grotesque Sans
  if (scores.structure === 3 && 
      [scores.tone, scores.energy, scores.design].filter(s => s <= 2).length >= 2 &&
      scores.era >= 4) {
    return 'Grotesque Sans';
  }

  return bestMatch || 'Humanist Sans';
}

function getMatchingFonts(aestheticStyle: string, scores: UserScores): FontData[] {
  const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

  if (matchingFonts.length === 0) {
    console.warn(`No fonts found for style '${aestheticStyle}'. Falling back to Humanist Sans.`);
    return fonts.filter(font => font.aestheticStyle === 'Humanist Sans');
  }

  // Sort fonts by how well they match the scores
  return matchingFonts.sort((a, b) => {
    const aScore = calculateFontMatchScore(a, scores);
    const bScore = calculateFontMatchScore(b, scores);
    return bScore - aScore;
  });
}

function calculateFontMatchScore(font: FontData, scores: UserScores): number {
  return Object.keys(scores).reduce((total, trait) => {
    const traitKey = trait as keyof UserScores;
    const diff = Math.abs(font[traitKey] - scores[traitKey]);
    return total - diff;
  }, 0);
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const matchingFonts = getMatchingFonts(aestheticStyle, scores);

  if (matchingFonts.length < 3) {
    console.warn(`Not enough fonts for style '${aestheticStyle}'. Using fallbacks.`);
    const humanistFonts = fonts.filter(font => font.aestheticStyle === 'Humanist Sans');
    return {
      primary: humanistFonts[0] || fallbackFont,
      secondary: humanistFonts[1] || fallbackFont,
      tertiary: humanistFonts[2] || fallbackFont,
      aestheticStyle: 'Humanist Sans'
    };
  }

  return {
    primary: matchingFonts[0],
    secondary: matchingFonts[1],
    tertiary: matchingFonts[2],
    aestheticStyle
  };
}