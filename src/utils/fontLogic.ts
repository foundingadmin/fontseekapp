import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  // Special case for all-1 scores
  if (Object.values(scores).every(score => score === 1)) {
    const serifOldStyleFonts = fonts.filter(font => font.aestheticStyle === 'Serif Old Style');
    return {
      primary: serifOldStyleFonts[0],
      secondary: serifOldStyleFonts[1],
      tertiary: serifOldStyleFonts[2],
      aestheticStyle: 'Serif Old Style'
    };
  }

  // Special case for neutral scores (all 3s)
  if (Object.values(scores).every(score => score === 3)) {
    const grotesqueSansFonts = fonts.filter(font => font.aestheticStyle === 'Grotesque Sans');
    return {
      primary: grotesqueSansFonts[0],
      secondary: grotesqueSansFonts[1],
      tertiary: grotesqueSansFonts[2],
      aestheticStyle: 'Grotesque Sans'
    };
  }

  // Determine aesthetic style based on trait ranges
  const aestheticStyle = determineAestheticStyle(scores);
  
  // Filter fonts to ONLY those matching the aesthetic style
  const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

  // Calculate distance scores for matching fonts
  const fontScores = matchingFonts.map(font => ({
    font,
    score: calculateFontScore(scores, font)
  }));

  // Sort by score (higher is better)
  fontScores.sort((a, b) => b.score - a.score);

  return {
    primary: fontScores[0].font,
    secondary: fontScores[1]?.font || fontScores[0].font,
    tertiary: fontScores[2]?.font || fontScores[1]?.font || fontScores[0].font,
    aestheticStyle
  };
}

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let bestScore = -Infinity;

  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    const score = calculateStyleScore(scores, ranges);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = style;
    }
  }

  return bestMatch;
}

function calculateStyleScore(scores: UserScores, ranges: any): number {
  let score = 0;
  const traits = ['tone', 'energy', 'design', 'era', 'structure'] as const;

  for (const trait of traits) {
    const value = scores[trait];
    const min = ranges[`${trait}Min`];
    const max = ranges[`${trait}Max`];

    // Perfect match within range
    if (value >= min && value <= max) {
      score += 2;
    }
    // Close to range
    else if (Math.abs(value - min) <= 1 || Math.abs(value - max) <= 1) {
      score += 1;
    }
    // Far from range
    else {
      score -= 1;
    }
  }

  return score;
}

function calculateFontScore(scores: UserScores, font: FontData): number {
  let score = 0;
  const traits = ['tone', 'energy', 'design', 'era', 'structure'] as const;

  for (const trait of traits) {
    const diff = Math.abs(scores[trait] - font[trait]);
    
    // Perfect match
    if (diff === 0) {
      score += 3;
    }
    // Close match
    else if (diff === 1) {
      score += 2;
    }
    // Acceptable match
    else if (diff === 2) {
      score += 1;
    }
    // Poor match
    else {
      score -= 1;
    }
  }

  return score;
}