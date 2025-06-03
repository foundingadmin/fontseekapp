import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';
import { getDisplayName } from '../utils/aestheticStyles';

function calculateStyleMatch(scores: UserScores, range: typeof aestheticScoring[keyof typeof aestheticScoring]): number {
  let matchScore = 0;
  
  const traits: (keyof UserScores)[] = ['tone', 'energy', 'design', 'era', 'structure'];
  
  for (const trait of traits) {
    const score = scores[trait];
    const min = range[`${trait}Min`];
    const max = range[`${trait}Max`];
    
    if (score >= min && score <= max) {
      matchScore += 1;
    }
  }
  
  return matchScore;
}

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let highestScore = -1;

  for (const [style, range] of Object.entries(aestheticScoring)) {
    const score = calculateStyleMatch(scores, range);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = style;
    }
  }

  return bestMatch;
}

function getFontsByAestheticStyle(style: string): FontData[] {
  return fonts.filter(font => {
    const displayName = getDisplayName(font.aestheticStyle);
    return displayName === style;
  });
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  let matchingFonts = getFontsByAestheticStyle(aestheticStyle);
  
  // If we don't have enough fonts in the primary style, find similar styles
  if (matchingFonts.length < 3) {
    const similarStyles = Object.entries(aestheticScoring)
      .filter(([style]) => style !== aestheticStyle)
      .sort((a, b) => {
        const scoreA = calculateStyleMatch(scores, a[1]);
        const scoreB = calculateStyleMatch(scores, b[1]);
        return scoreB - scoreA;
      })
      .map(([style]) => style);
    
    for (const style of similarStyles) {
      const additionalFonts = getFontsByAestheticStyle(style);
      matchingFonts = [...matchingFonts, ...additionalFonts];
      if (matchingFonts.length >= 3) break;
    }
  }

  // Sort fonts by how well they match the scores
  matchingFonts.sort((a, b) => {
    const distanceA = Math.abs(a.tone - scores.tone) +
                     Math.abs(a.energy - scores.energy) +
                     Math.abs(a.design - scores.design) +
                     Math.abs(a.era - scores.era) +
                     Math.abs(a.structure - scores.structure);
                     
    const distanceB = Math.abs(b.tone - scores.tone) +
                     Math.abs(b.energy - scores.energy) +
                     Math.abs(b.design - scores.design) +
                     Math.abs(b.era - scores.era) +
                     Math.abs(b.structure - scores.structure);
                     
    return distanceA - distanceB;
  });

  return {
    aestheticStyle,
    primary: matchingFonts[0],
    secondary: matchingFonts[1],
    tertiary: matchingFonts[2]
  };
}

export function getTopTraits(scores: UserScores): string[] {
  const traits = [
    { name: 'Modern', score: scores.era },
    { name: 'Energetic', score: scores.energy },
    { name: 'Expressive', score: scores.design },
    { name: 'Geometric', score: scores.structure },
    { name: 'Casual', score: scores.tone }
  ];

  return traits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(t => t.name);
}