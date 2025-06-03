import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

function calculateFontDistance(font: FontData, scores: UserScores): number {
  return Math.abs(font.tone - scores.tone) +
         Math.abs(font.energy - scores.energy) +
         Math.abs(font.design - scores.design) +
         Math.abs(font.era - scores.era) +
         Math.abs(font.structure - scores.structure);
}

function determineAestheticStyle(scores: UserScores): string {
  let bestMatch = '';
  let smallestDistance = Infinity;

  for (const font of fonts) {
    const distance = calculateFontDistance(font, scores);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      bestMatch = font.aestheticStyle;
    }
  }

  return bestMatch;
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  
  // Get all fonts sorted by how well they match the user's scores
  const sortedFonts = [...fonts].sort((a, b) => 
    calculateFontDistance(a, scores) - calculateFontDistance(b, scores)
  );

  // Try to get fonts of the same aesthetic style first
  const matchingFonts = sortedFonts.filter(font => 
    font.aestheticStyle === aestheticStyle
  );

  // If we don't have enough matching fonts, use the best matching fonts regardless of style
  const recommendations = {
    aestheticStyle,
    primary: matchingFonts[0] || sortedFonts[0],
    secondary: matchingFonts[1] || sortedFonts[1],
    tertiary: matchingFonts[2] || sortedFonts[2]
  };

  // Ensure we have valid fonts for all positions
  if (!recommendations.primary || !recommendations.secondary || !recommendations.tertiary) {
    throw new Error('Not enough fonts available for recommendations');
  }

  return recommendations;
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