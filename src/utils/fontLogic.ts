import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

// Aesthetic style trait weights
const aestheticWeights: Record<string, Partial<Record<keyof UserScores, number>>> = {
  'Monospace': {
    structure: 1.5,
    era: 1.25,
  },
  'Rounded Sans': {
    tone: 1.5,
    energy: 1.25,
  },
  'Geometric Sans': {
    design: 1.5,
    structure: 1.25,
  },
  'Classic Serif': {
    era: 1.5,
    design: 1.25,
  },
  'Display Sans': {
    energy: 1.5,
    design: 1.25,
  }
};

// Default fallback font
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

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  // First, determine the aesthetic style based on the user's scores
  const primaryStyle = determineAestheticStyle(scores);
  
  // Strictly filter fonts to only those matching the primary style
  let matchingFonts = fonts.filter(font => font.aestheticStyle === primaryStyle);

  // Calculate weighted scores for each font
  const fontScores = matchingFonts.map(font => ({
    font,
    score: calculateWeightedScore(scores, font, primaryStyle)
  }));

  // Sort by score (higher is better)
  fontScores.sort((a, b) => b.score - a.score);

  // Get unique top fonts
  const selectedFonts = getUniqueFonts(fontScores);

  // If we don't have enough fonts, get fonts from similar styles
  if (selectedFonts.length < 3) {
    const similarStyles = getSimilarStyles(primaryStyle, scores);
    for (const style of similarStyles) {
      const additionalFonts = fonts
        .filter(font => 
          font.aestheticStyle === style && 
          !selectedFonts.some(selected => selected.name === font.name)
        )
        .map(font => ({
          font,
          score: calculateWeightedScore(scores, font, style)
        }))
        .sort((a, b) => b.score - a.score);

      selectedFonts.push(...getUniqueFonts(additionalFonts, 3 - selectedFonts.length));
      
      if (selectedFonts.length >= 3) break;
    }
  }

  return {
    primary: selectedFonts[0] || fallbackFont,
    secondary: selectedFonts[1] || selectedFonts[0] || fallbackFont,
    tertiary: selectedFonts[2] || selectedFonts[1] || fallbackFont,
    aestheticStyle: primaryStyle
  };
}

function calculateWeightedScore(scores: UserScores, font: FontData, style: string): number {
  const weights = aestheticWeights[style] || {};
  let totalScore = 0;
  let totalWeight = 0;

  const calculateTraitScore = (trait: keyof UserScores) => {
    const weight = weights[trait] || 1;
    const diff = Math.abs(scores[trait] - font[trait]);
    // Exponential penalty for larger differences
    const penalty = diff * diff;
    return (5 - penalty) * weight;
  };

  // Calculate weighted scores for each trait
  Object.keys(scores).forEach(trait => {
    const weight = weights[trait as keyof UserScores] || 1;
    totalScore += calculateTraitScore(trait as keyof UserScores);
    totalWeight += weight;
  });

  return totalScore / totalWeight;
}

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let bestScore = -Infinity;

  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    const score = calculateStyleMatchScore(scores, ranges);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = style;
    }
  }

  return bestMatch;
}

function calculateStyleMatchScore(scores: UserScores, ranges: any): number {
  let totalScore = 0;

  // Calculate score for each trait
  const traits = [
    { trait: 'tone', min: ranges.toneMin, max: ranges.toneMax },
    { trait: 'energy', min: ranges.energyMin, max: ranges.energyMax },
    { trait: 'design', min: ranges.designMin, max: ranges.designMax },
    { trait: 'era', min: ranges.eraMin, max: ranges.eraMax },
    { trait: 'structure', min: ranges.structureMin, max: ranges.structureMax }
  ];

  for (const { trait, min, max } of traits) {
    const score = scores[trait as keyof UserScores];
    if (score >= min && score <= max) {
      totalScore += 1;
    } else {
      // Exponential penalty for being outside the range
      const distance = Math.min(Math.abs(score - min), Math.abs(score - max));
      totalScore -= (distance * distance) / 10;
    }
  }

  return totalScore;
}

function getSimilarStyles(currentStyle: string, scores: UserScores): string[] {
  return Object.entries(aestheticScoring)
    .filter(([style]) => style !== currentStyle)
    .map(([style, ranges]) => ({
      style,
      score: calculateStyleMatchScore(scores, ranges)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(result => result.style);
}

function getUniqueFonts(fontScores: { font: FontData; score: number }[], limit = 3): FontData[] {
  const uniqueFonts: FontData[] = [];
  const seenNames = new Set<string>();

  for (const { font } of fontScores) {
    if (!seenNames.has(font.name)) {
      uniqueFonts.push(font);
      seenNames.add(font.name);
      if (uniqueFonts.length === limit) break;
    }
  }

  return uniqueFonts;
}