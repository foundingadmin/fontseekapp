import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';
import { getDisplayName } from './aestheticStyles';

const CLASSIC_EDITORIAL_FONTS = [
  'Lora',
  'EB Garamond',
  'Crimson Pro',
  'Domine',
  'Libre Baskerville',
  'Playfair Display',
  'Merriweather'
];

function isClassicEditorial(scores: UserScores): boolean {
  return (
    scores.tone <= 2 &&
    scores.energy <= 2 &&
    scores.design <= 2 &&
    scores.era >= 4 &&
    scores.structure <= 2
  );
}

function getClassicEditorialFonts(): FontData[] {
  return fonts
    .filter(font => {
      // Only include serif fonts from our approved list
      return (
        CLASSIC_EDITORIAL_FONTS.includes(font.name) &&
        !font.aestheticStyle.toLowerCase().includes('display') &&
        !font.aestheticStyle.toLowerCase().includes('sans')
      );
    })
    .sort((a, b) => {
      // Sort by priority in CLASSIC_EDITORIAL_FONTS array
      const aIndex = CLASSIC_EDITORIAL_FONTS.indexOf(a.name);
      const bIndex = CLASSIC_EDITORIAL_FONTS.indexOf(b.name);
      return aIndex - bIndex;
    });
}

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
  // Force Classic Editorial for specific score combinations
  if (isClassicEditorial(scores)) {
    return 'Classic Editorial';
  }

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

function getFontsByAestheticStyle(style: string, scores: UserScores): FontData[] {
  // Special handling for Classic Editorial
  if (style === 'Classic Editorial') {
    return getClassicEditorialFonts();
  }

  // Filter out modern sans and display fonts for traditional scores
  const isTraditional = scores.tone <= 2 && scores.energy <= 2;
  
  return fonts.filter(font => {
    const displayName = getDisplayName(font.aestheticStyle);
    
    if (isTraditional) {
      const style = font.aestheticStyle.toLowerCase();
      if (style.includes('modern') || style.includes('geometric') || style.includes('display')) {
        return false;
      }
    }
    
    return displayName === style;
  });
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  let matchingFonts = getFontsByAestheticStyle(aestheticStyle, scores);

  // For Classic Editorial, ensure we have enough serif options
  if (aestheticStyle === 'Classic Editorial' && matchingFonts.length < 3) {
    const additionalSerifs = fonts.filter(font => 
      font.aestheticStyle.toLowerCase().includes('serif') &&
      !matchingFonts.some(f => f.name === font.name) &&
      !font.aestheticStyle.toLowerCase().includes('display')
    );
    matchingFonts = [...matchingFonts, ...additionalSerifs];
  }

  // Sort fonts by trait match score
  matchingFonts.sort((a, b) => {
    const scoreA = Math.abs(a.tone - scores.tone) +
                  Math.abs(a.energy - scores.energy) +
                  Math.abs(a.design - scores.design) +
                  Math.abs(a.era - scores.era) +
                  Math.abs(a.structure - scores.structure);
                  
    const scoreB = Math.abs(b.tone - scores.tone) +
                  Math.abs(b.energy - scores.energy) +
                  Math.abs(b.design - scores.design) +
                  Math.abs(b.era - scores.era) +
                  Math.abs(b.structure - scores.structure);
                  
    return scoreA - scoreB;
  });

  // Ensure we have at least 3 fonts
  while (matchingFonts.length < 3) {
    matchingFonts.push(matchingFonts[0]); // Duplicate the best match if needed
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