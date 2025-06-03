import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

interface StyleRange {
  toneMin: number;
  toneMax: number;
  energyMin: number;
  energyMax: number;
  designMin: number;
  designMax: number;
  eraMin: number;
  eraMax: number;
  structureMin: number;
  structureMax: number;
}

function matchesStyleRange(scores: UserScores, range: StyleRange): boolean {
  return (
    scores.tone >= range.toneMin && scores.tone <= range.toneMax &&
    scores.energy >= range.energyMin && scores.energy <= range.energyMax &&
    scores.design >= range.designMin && scores.design <= range.designMax &&
    scores.era >= range.eraMin && scores.era <= range.eraMax &&
    scores.structure >= range.structureMin && scores.structure <= range.structureMax
  );
}

function calculateStyleDistance(scores: UserScores, range: StyleRange): number {
  const getMidpoint = (min: number, max: number) => (min + max) / 2;
  
  return (
    Math.abs(scores.tone - getMidpoint(range.toneMin, range.toneMax)) +
    Math.abs(scores.energy - getMidpoint(range.energyMin, range.energyMax)) +
    Math.abs(scores.design - getMidpoint(range.designMin, range.designMax)) +
    Math.abs(scores.era - getMidpoint(range.eraMin, range.eraMax)) +
    Math.abs(scores.structure - getMidpoint(range.structureMin, range.structureMax))
  );
}

function calculateRangeGap(scores: UserScores, range: StyleRange): number {
  return (
    (range.toneMax - range.toneMin) +
    (range.energyMax - range.energyMin) +
    (range.designMax - range.designMin) +
    (range.eraMax - range.eraMin) +
    (range.structureMax - range.structureMin)
  );
}

function determineAestheticStyle(scores: UserScores): string {
  // Step 1: Try exact range matches
  const exactMatches = Object.entries(aestheticScoring)
    .filter(([_, range]) => matchesStyleRange(scores, range))
    .sort((a, b) => calculateRangeGap(scores, a[1]) - calculateRangeGap(scores, b[1]));

  if (exactMatches.length > 0) {
    return exactMatches[0][0]; // Return style with tightest fit
  }

  // Step 2: Find closest match by trait distance
  let closestStyle = '';
  let smallestDistance = Infinity;

  Object.entries(aestheticScoring).forEach(([style, range]) => {
    const distance = calculateStyleDistance(scores, range);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestStyle = style;
    }
  });

  return closestStyle;
}

function calculateFontDistance(font: FontData, scores: UserScores): number {
  const weights = {
    tone: 1.2,    // Slightly higher weight for tone
    energy: 1.1,  // Slightly higher weight for energy
    design: 1.0,  // Standard weight
    era: 0.9,     // Slightly lower weight
    structure: 0.8 // Slightly lower weight
  };

  return (
    Math.abs(font.tone - scores.tone) * weights.tone +
    Math.abs(font.energy - scores.energy) * weights.energy +
    Math.abs(font.design - scores.design) * weights.design +
    Math.abs(font.era - scores.era) * weights.era +
    Math.abs(font.structure - scores.structure) * weights.structure
  );
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  try {
    const aestheticStyle = determineAestheticStyle(scores);
    
    // Filter fonts by aesthetic style
    let matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);

    // Sort fonts by weighted distance score
    matchingFonts.sort((a, b) => calculateFontDistance(a, scores) - calculateFontDistance(b, scores));

    // Ensure we have enough unique fonts
    if (matchingFonts.length >= 3) {
      return {
        aestheticStyle,
        primary: matchingFonts[0],
        secondary: matchingFonts[1],
        tertiary: matchingFonts[2]
      };
    }

    // If we don't have enough fonts in the primary style, find close alternatives
    const alternativeFonts = fonts
      .filter(font => font.aestheticStyle !== aestheticStyle)
      .sort((a, b) => calculateFontDistance(a, scores) - calculateFontDistance(b, scores));

    while (matchingFonts.length < 3 && alternativeFonts.length > 0) {
      matchingFonts.push(alternativeFonts.shift()!);
    }

    return {
      aestheticStyle,
      primary: matchingFonts[0],
      secondary: matchingFonts[1],
      tertiary: matchingFonts[2]
    };

  } catch (error) {
    console.error('Error calculating font recommendations:', error);
    throw new Error('Failed to calculate font recommendations. Please try again.');
  }
}

export function getTopTraits(scores: UserScores): string[] {
  const traitScores = [
    { trait: 'Formal', score: 6 - scores.tone },
    { trait: 'Casual', score: scores.tone },
    { trait: 'Calm', score: 6 - scores.energy },
    { trait: 'Energetic', score: scores.energy },
    { trait: 'Minimal', score: 6 - scores.design },
    { trait: 'Expressive', score: scores.design },
    { trait: 'Classic', score: 6 - scores.era },
    { trait: 'Modern', score: scores.era },
    { trait: 'Organic', score: 6 - scores.structure },
    { trait: 'Geometric', score: scores.structure }
  ];

  return traitScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(t => t.trait);
}