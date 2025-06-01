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

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  // First, determine the aesthetic style based on the user's scores
  const matchingStyles = determineAestheticStyles(scores);
  
  // Get fonts matching any of the matching aesthetic styles
  let matchingFonts = fonts.filter(font => 
    matchingStyles.includes(font.aestheticStyle)
  );
  
  // If we don't have enough fonts, include fonts from similar styles
  if (matchingFonts.length < 3) {
    const similarStyles = getSimilarStyles(matchingStyles[0], scores);
    matchingFonts = [
      ...matchingFonts,
      ...fonts.filter(font => 
        similarStyles.includes(font.aestheticStyle) && 
        !matchingFonts.some(f => f.name === font.name)
      )
    ];
  }

  // Calculate weighted distance scores for each matching font
  const fontScores = matchingFonts.map(font => ({
    font,
    score: calculateWeightedScore(scores, font)
  }));

  // Sort by score (higher is better)
  fontScores.sort((a, b) => b.score - a.score);

  // Get unique fonts by selecting the best scoring fonts with different names
  const uniqueFonts = getUniqueFonts(fontScores);

  // Get the primary aesthetic style from the best matching font
  const primaryStyle = uniqueFonts[0]?.aestheticStyle || matchingStyles[0];

  return {
    primary: uniqueFonts[0] || fallbackFont,
    secondary: uniqueFonts[1] || uniqueFonts[0] || fallbackFont,
    tertiary: uniqueFonts[2] || uniqueFonts[1] || fallbackFont,
    aestheticStyle: primaryStyle
  };
}

function getUniqueFonts(fontScores: { font: FontData; score: number }[]): FontData[] {
  const uniqueFonts: FontData[] = [];
  const seenNames = new Set<string>();
  const seenStyles = new Set<string>();

  for (const { font } of fontScores) {
    // Ensure we get a mix of different aesthetic styles when possible
    if (!seenNames.has(font.name) && 
        (uniqueFonts.length < 2 || !seenStyles.has(font.aestheticStyle))) {
      uniqueFonts.push(font);
      seenNames.add(font.name);
      seenStyles.add(font.aestheticStyle);
      if (uniqueFonts.length === 3) break;
    }
  }

  return uniqueFonts;
}

function determineAestheticStyles(scores: UserScores): string[] {
  const styleScores = Object.entries(aestheticScoring).map(([style, ranges]) => ({
    style,
    match: calculateStyleMatch(scores, ranges)
  }));

  // Sort by match score (higher is better)
  styleScores.sort((a, b) => b.match - a.match);

  // Return top 3 matching styles
  return styleScores.slice(0, 3).map(s => s.style);
}

function calculateStyleMatch(scores: UserScores, ranges: any): number {
  let matchScore = 0;
  
  // Check how well each trait matches the style's range
  matchScore += getTraitMatchScore(scores.tone, ranges.toneMin, ranges.toneMax);
  matchScore += getTraitMatchScore(scores.energy, ranges.energyMin, ranges.energyMax);
  matchScore += getTraitMatchScore(scores.design, ranges.designMin, ranges.designMax);
  matchScore += getTraitMatchScore(scores.era, ranges.eraMin, ranges.eraMax);
  matchScore += getTraitMatchScore(scores.structure, ranges.structureMin, ranges.structureMax);
  
  return matchScore;
}

function getTraitMatchScore(score: number, min: number, max: number): number {
  if (score >= min && score <= max) return 1; // Perfect match
  const distanceToRange = Math.min(Math.abs(score - min), Math.abs(score - max));
  return 1 / (1 + distanceToRange); // Score decreases with distance from range
}

function getSimilarStyles(primaryStyle: string, scores: UserScores): string[] {
  // Calculate style match scores for all styles except the primary
  const styleScores = Object.entries(aestheticScoring)
    .filter(([style]) => style !== primaryStyle)
    .map(([style, ranges]) => ({
      style,
      match: calculateStyleMatch(scores, ranges)
    }));

  // Sort by match score and return top 2 similar styles
  return styleScores
    .sort((a, b) => b.match - a.match)
    .slice(0, 2)
    .map(s => s.style);
}

function calculateWeightedScore(scores: UserScores, font: FontData): number {
  const weights = {
    tone: 1.2,     // Slightly higher weight for tone as it's crucial for brand voice
    energy: 1.1,   // Energy level is important for brand personality
    design: 1.0,   // Standard weight for design expressiveness
    era: 0.9,      // Slightly lower weight as era can be more flexible
    structure: 0.8 // Lower weight as structure can be more adaptable
  };

  // Calculate weighted trait matches
  const toneMatch = (5 - Math.abs(scores.tone - font.tone)) * weights.tone;
  const energyMatch = (5 - Math.abs(scores.energy - font.energy)) * weights.energy;
  const designMatch = (5 - Math.abs(scores.design - font.design)) * weights.design;
  const eraMatch = (5 - Math.abs(scores.era - font.era)) * weights.era;
  const structureMatch = (5 - Math.abs(scores.structure - font.structure)) * weights.structure;

  // Return total weighted score
  return toneMatch + energyMatch + designMatch + eraMatch + structureMatch;
}