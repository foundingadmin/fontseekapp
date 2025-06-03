import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

function calculateTraitScore(answers: Record<number, 'A' | 'B'>, questionPair: [number, number]): number {
  const score1 = answers[questionPair[0]] === 'A' ? 1 : 5;
  const score2 = answers[questionPair[1]] === 'A' ? 1 : 5;
  return Math.round((score1 + score2) / 2);
}

function matchesAestheticStyle(scores: UserScores, ranges: Record<string, [number, number]>): boolean {
  return Object.entries(ranges).every(([trait, [min, max]]) => {
    const score = scores[trait as keyof UserScores];
    return score >= min && score <= max;
  });
}

function determineAestheticStyle(scores: UserScores): string {
  const styleRanges = [
    {
      name: 'Grotesque Sans',
      ranges: {
        tone: [2, 4],
        energy: [2, 4],
        design: [1, 3],
        era: [3, 5],
        structure: [3, 5]
      }
    },
    {
      name: 'Geometric Sans',
      ranges: {
        tone: [3, 5],
        energy: [3, 5],
        design: [2, 4],
        era: [3, 5],
        structure: [4, 5]
      }
    },
    {
      name: 'Humanist Sans',
      ranges: {
        tone: [3, 5],
        energy: [2, 4],
        design: [2, 3],
        era: [2, 4],
        structure: [1, 3]
      }
    },
    {
      name: 'Rounded Sans',
      ranges: {
        tone: [3, 5],
        energy: [3, 5],
        design: [3, 5],
        era: [2, 4],
        structure: [1, 2]
      }
    },
    {
      name: 'Monospace',
      ranges: {
        tone: [2, 3],
        energy: [1, 2],
        design: [1, 2],
        era: [2, 3],
        structure: [5, 5]
      }
    },
    {
      name: 'Display / Bubbly',
      ranges: {
        tone: [4, 5],
        energy: [4, 5],
        design: [4, 5],
        era: [3, 5],
        structure: [1, 3]
      }
    },
    {
      name: 'Transitional Serif',
      ranges: {
        tone: [1, 3],
        energy: [1, 3],
        design: [2, 4],
        era: [3, 5],
        structure: [2, 4]
      }
    },
    {
      name: 'Serif Old Style',
      ranges: {
        tone: [1, 2],
        energy: [1, 3],
        design: [2, 3],
        era: [1, 3],
        structure: [1, 3]
      }
    }
  ];

  // Try to find an exact match first
  for (const style of styleRanges) {
    if (matchesAestheticStyle(scores, style.ranges)) {
      return style.name;
    }
  }

  // If no exact match, find closest match by calculating distance to range midpoints
  let closestStyle = styleRanges[0];
  let smallestDistance = Infinity;

  for (const style of styleRanges) {
    let distance = 0;
    Object.entries(style.ranges).forEach(([trait, [min, max]]) => {
      const midpoint = (min + max) / 2;
      const score = scores[trait as keyof UserScores];
      distance += Math.abs(score - midpoint);
    });

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestStyle = style;
    }
  }

  return closestStyle.name;
}

function calculateFontDistance(font: FontData, scores: UserScores): number {
  return Math.abs(font.tone - scores.tone) +
         Math.abs(font.energy - scores.energy) +
         Math.abs(font.design - scores.design) +
         Math.abs(font.era - scores.era) +
         Math.abs(font.structure - scores.structure);
}

function getSystemDefaultFont(): FontData {
  return {
    name: 'System UI',
    googleFontsLink: '',
    tone: 3,
    energy: 3,
    design: 3,
    era: 3,
    structure: 3,
    aestheticStyle: 'System Default',
    embedCode: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    personalityTags: ['Clean', 'Universal', 'Reliable'],
    recommendedFor: ['Apps', 'Interfaces', 'System Tools']
  };
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  
  // Filter fonts by aesthetic style
  let matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

  // If no matching fonts found, return system defaults
  if (matchingFonts.length === 0) {
    const systemFont = getSystemDefaultFont();
    return {
      aestheticStyle: 'System Default',
      primary: systemFont,
      secondary: systemFont,
      tertiary: systemFont
    };
  }

  // Sort fonts by distance score (ascending)
  matchingFonts.sort((a, b) => calculateFontDistance(a, scores) - calculateFontDistance(b, scores));

  // Ensure we have enough fonts, pad with system defaults if needed
  while (matchingFonts.length < 3) {
    matchingFonts.push(getSystemDefaultFont());
  }

  return {
    aestheticStyle,
    primary: matchingFonts[0],
    secondary: matchingFonts[1],
    tertiary: matchingFonts[2]
  };
}

export function getTopTraits(scores: UserScores): string[] {
  const traits = [
    { name: 'Formal', score: 6 - scores.tone },
    { name: 'Casual', score: scores.tone },
    { name: 'Calm', score: 6 - scores.energy },
    { name: 'Energetic', score: scores.energy },
    { name: 'Minimal', score: 6 - scores.design },
    { name: 'Expressive', score: scores.design },
    { name: 'Classic', score: 6 - scores.era },
    { name: 'Modern', score: scores.era },
    { name: 'Organic', score: 6 - scores.structure },
    { name: 'Geometric', score: scores.structure }
  ];

  return traits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(trait => trait.name);
}