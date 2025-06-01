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

// Keep track of recently used fonts to avoid repetition
const recentlyUsedFonts = new Set<string>();

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  // First, determine the primary aesthetic style based on scores
  const primaryStyle = determineOverallStyle('', scores);
  
  // Get all fonts that match the primary style
  let matchingFonts = fonts.filter(font => 
    font.aestheticStyle === primaryStyle && 
    !recentlyUsedFonts.has(font.name)
  );

  // If we don't have enough fonts in the primary style, get fonts from similar styles
  if (matchingFonts.length < 3) {
    const similarStyles = getSimilarStyles(primaryStyle, scores);
    const additionalFonts = fonts.filter(font => 
      similarStyles.includes(font.aestheticStyle) && 
      !recentlyUsedFonts.has(font.name) &&
      !matchingFonts.some(f => f.name === font.name)
    );
    matchingFonts = [...matchingFonts, ...additionalFonts];
  }

  // Calculate scores for matching fonts
  const fontScores = matchingFonts.map(font => ({
    font,
    score: calculateTraitScore(scores, font)
  }));

  // Sort by score (higher is better)
  fontScores.sort((a, b) => b.score - a.score);

  // Select top 3 fonts
  const selectedFonts = fontScores.slice(0, 3).map(fs => fs.font);

  // Update recently used fonts
  selectedFonts.forEach(font => {
    if (font) recentlyUsedFonts.add(font.name);
  });

  // Keep only the last 9 fonts (3 sets) in memory
  if (recentlyUsedFonts.size > 9) {
    const oldestFonts = Array.from(recentlyUsedFonts).slice(0, recentlyUsedFonts.size - 9);
    oldestFonts.forEach(font => recentlyUsedFonts.delete(font));
  }

  return {
    primary: selectedFonts[0] || fallbackFont,
    secondary: selectedFonts[1] || selectedFonts[0] || fallbackFont,
    tertiary: selectedFonts[2] || selectedFonts[1] || fallbackFont,
    aestheticStyle: primaryStyle
  };
}

function calculateTraitScore(scores: UserScores, font: FontData): number {
  const weights = {
    tone: 2.0,     // Highest weight - crucial for brand voice
    energy: 1.8,   // Very important for personality
    design: 1.5,   // Important for visual impact
    era: 1.2,      // Less critical but still relevant
    structure: 1.0 // Base weight for structural aspects
  };

  const getTraitScore = (userScore: number, fontScore: number): number => {
    const diff = Math.abs(userScore - fontScore);
    return Math.max(5 - diff, 0); // 5 is max score, decreases with difference
  };

  return (
    getTraitScore(scores.tone, font.tone) * weights.tone +
    getTraitScore(scores.energy, font.energy) * weights.energy +
    getTraitScore(scores.design, font.design) * weights.design +
    getTraitScore(scores.era, font.era) * weights.era +
    getTraitScore(scores.structure, font.structure) * weights.structure
  );
}

function getSimilarStyles(primaryStyle: string, scores: UserScores): string[] {
  // Calculate style match scores for all styles
  const styleScores = Object.entries(aestheticScoring).map(([style, ranges]) => ({
    style,
    match: calculateStyleMatch(scores, style)
  }));

  // Sort by match score and filter out the primary style
  return styleScores
    .filter(score => score.style !== primaryStyle)
    .sort((a, b) => b.match - a.match)
    .slice(0, 2) // Get top 2 similar styles
    .map(score => score.style);
}

function calculateStyleMatch(scores: UserScores, style: string): number {
  const ranges = aestheticScoring[style];
  if (!ranges) return 0;

  // Calculate how well each trait matches the style's range
  let match = 0;
  
  if (scores.tone >= ranges.toneMin && scores.tone <= ranges.toneMax) match++;
  if (scores.energy >= ranges.energyMin && scores.energy <= ranges.energyMax) match++;
  if (scores.design >= ranges.designMin && scores.design <= ranges.designMax) match++;
  if (scores.era >= ranges.eraMin && scores.era <= ranges.eraMax) match++;
  if (scores.structure >= ranges.structureMin && scores.structure <= ranges.structureMax) match++;

  return match;
}

function determineOverallStyle(currentStyle: string, scores: UserScores): string {
  // Calculate match scores for all styles
  const styleScores = Object.entries(aestheticScoring).map(([style, ranges]) => ({
    style,
    match: calculateStyleMatch(scores, style)
  }));

  // Sort by match score (higher is better)
  styleScores.sort((a, b) => b.match - a.match);

  // Return the best matching style
  return styleScores[0]?.style || 'Geometric Sans';
}