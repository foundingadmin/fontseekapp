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

function isExactNeutralScore(scores: UserScores): boolean {
  return Object.values(scores).every(score => score === 3);
}

function determineAestheticStyle(scores: UserScores): string {
  // Return System Default only for exact neutral scores
  if (isExactNeutralScore(scores)) {
    return 'System Default';
  }

  // Modern Serif check (high design + high era + low structure)
  if (scores.design >= 4 && scores.era >= 4 && scores.structure <= 2) {
    return 'Modern Serif';
  }

  // Check other styles with strict matching
  let bestMatch = '';
  let bestMatchScore = -1;

  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    let matchScore = 0;
    let isValid = true;

    for (const trait of ['tone', 'energy', 'design', 'era', 'structure'] as const) {
      const score = scores[trait];
      const min = ranges[`${trait}Min`];
      const max = ranges[`${trait}Max`];

      if (score < min || score > max) {
        isValid = false;
        break;
      }

      // Calculate how well this trait matches (closer to range center is better)
      const center = (min + max) / 2;
      const distance = Math.abs(score - center);
      matchScore += 1 - (distance / 4); // Normalize to 0-1 range
    }

    if (isValid && matchScore > bestMatchScore) {
      bestMatch = style;
      bestMatchScore = matchScore;
    }
  }

  return bestMatch || 'Modern Serif'; // Fallback to Modern Serif if no match found
}

function getMatchingFonts(aestheticStyle: string, scores: UserScores): FontData[] {
  if (aestheticStyle === 'System Default') {
    return [fallbackFont];
  }

  const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

  if (matchingFonts.length === 0) {
    console.warn(`No fonts found for style '${aestheticStyle}'. Falling back to Modern Serif.`);
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
    tone: 1,
    energy: 1,
    design: 1.5,
    era: 1.5,
    structure: 2
  };

  for (const trait of Object.keys(scores) as Array<keyof UserScores>) {
    const diff = Math.abs(font[trait] - scores[trait]);
    totalScore += (4 - diff) * weights[trait]; // 4 is max possible difference
  }

  return totalScore;
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  
  if (aestheticStyle === 'System Default') {
    return {
      primary: fallbackFont,
      secondary: fallbackFont,
      tertiary: fallbackFont,
      aestheticStyle
    };
  }

  const matchingFonts = getMatchingFonts(aestheticStyle, scores);

  if (matchingFonts.length < 3) {
    const modernSerifFonts = fonts.filter(font => font.aestheticStyle === 'Modern Serif');
    return {
      primary: matchingFonts[0] || modernSerifFonts[0] || fallbackFont,
      secondary: matchingFonts[1] || modernSerifFonts[1] || fallbackFont,
      tertiary: matchingFonts[2] || modernSerifFonts[2] || fallbackFont,
      aestheticStyle: matchingFonts.length > 0 ? aestheticStyle : 'Modern Serif'
    };
  }

  return {
    primary: matchingFonts[0],
    secondary: matchingFonts[1],
    tertiary: matchingFonts[2],
    aestheticStyle
  };
}