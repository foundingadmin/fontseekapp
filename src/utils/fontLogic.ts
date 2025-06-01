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
  // Check Geometric Sans first (high structure + balanced traits)
  if (scores.structure >= 5 && scores.design >= 3 && scores.tone >= 3) {
    return 'Geometric Sans';
  }

  // Check Grotesque Sans (neutral traits + modern era)
  if (scores.structure >= 3 && scores.structure <= 4 && 
      scores.era >= 4 && 
      scores.tone <= 3 && 
      scores.design <= 3) {
    return 'Grotesque Sans';
  }

  // Check other styles with strict matching
  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    if (style === 'Geometric Sans' || style === 'Grotesque Sans') continue;

    let matches = true;
    for (const trait of ['tone', 'energy', 'design', 'era', 'structure'] as const) {
      const score = scores[trait];
      const min = ranges[`${trait}Min`];
      const max = ranges[`${trait}Max`];

      if (score < min || score > max) {
        matches = false;
        break;
      }
    }

    if (matches) return style;
  }

  // Default to Grotesque Sans if no clear match
  // (neutral, structured, modern fonts work well as a fallback)
  return 'Grotesque Sans';
}

function getMatchingFonts(aestheticStyle: string, scores: UserScores): FontData[] {
  const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

  if (matchingFonts.length === 0) {
    console.warn(`No fonts found for style '${aestheticStyle}'. Falling back to Grotesque Sans.`);
    return fonts.filter(font => font.aestheticStyle === 'Grotesque Sans');
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
    const grotesqueFonts = fonts.filter(font => font.aestheticStyle === 'Grotesque Sans');
    return {
      primary: grotesqueFonts[0] || fallbackFont,
      secondary: grotesqueFonts[1] || fallbackFont,
      tertiary: grotesqueFonts[2] || fallbackFont,
      aestheticStyle: 'Grotesque Sans'
    };
  }

  return {
    primary: matchingFonts[0],
    secondary: matchingFonts[1],
    tertiary: matchingFonts[2],
    aestheticStyle
  };
}