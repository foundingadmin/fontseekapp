import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

const CLASSIC_EDITORIAL_FONTS = [
  'Merriweather',
  'Playfair Display',
  'Lora',
  'EB Garamond',
  'Libre Baskerville',
  'Crimson Pro',
  'Domine'
];

function isClassicEditorial(scores: UserScores): boolean {
  return (
    scores.tone <= 2 &&
    scores.energy <= 2 &&
    scores.design <= 2 &&
    scores.era <= 2 &&
    scores.structure <= 2
  );
}

function getClassicEditorialFonts(): FontData[] {
  return fonts
    .filter(font => CLASSIC_EDITORIAL_FONTS.includes(font.name))
    .sort((a, b) => {
      const aIndex = CLASSIC_EDITORIAL_FONTS.indexOf(a.name);
      const bIndex = CLASSIC_EDITORIAL_FONTS.indexOf(b.name);
      return aIndex - bIndex;
    });
}

function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  // Check for Classic Editorial style first
  if (isClassicEditorial(scores)) {
    const editorialFonts = getClassicEditorialFonts();
    
    if (editorialFonts.length >= 3) {
      return {
        aestheticStyle: 'Classic Editorial',
        primary: editorialFonts[0],
        secondary: editorialFonts[1],
        tertiary: editorialFonts[2]
      };
    }
  }

  // Calculate trait match scores for each font
  const fontScores = fonts.map(font => {
    const score = Math.abs(font.tone - scores.tone) +
                 Math.abs(font.energy - scores.energy) +
                 Math.abs(font.design - scores.design) +
                 Math.abs(font.era - scores.era) +
                 Math.abs(font.structure - scores.structure);
    
    return { font, score };
  });

  // Sort by match score (lower is better)
  fontScores.sort((a, b) => a.score - b.score);

  // Get the best matching fonts
  const bestMatches = fontScores.slice(0, 3).map(match => match.font);

  return {
    aestheticStyle: bestMatches[0].aestheticStyle,
    primary: bestMatches[0],
    secondary: bestMatches[1],
    tertiary: bestMatches[2]
  };
}

export function getTopTraits(scores: UserScores): string[] {
  const traits = [
    { name: 'Traditional', score: 6 - scores.era },
    { name: 'Serious', score: 6 - scores.tone },
    { name: 'Refined', score: 6 - scores.energy },
    { name: 'Classic', score: 6 - scores.design },
    { name: 'Structured', score: scores.structure }
  ];

  return traits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(t => t.name);
}

export { calculateFontRecommendations };