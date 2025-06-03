import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

const AESTHETIC_WHITELISTS = {
  'Classic Editorial': [
    'Libre Baskerville',
    'EB Garamond',
    'Lora',
    'Merriweather',
    'Playfair Display'
  ],
  'Modern & Minimal': [
    'Inter',
    'Work Sans',
    'IBM Plex Sans',
    'Space Grotesk',
    'Manrope'
  ],
  'Friendly & Playful': [
    'Baloo 2',
    'Fredoka',
    'Quicksand',
    'Nunito',
    'Comic Neue'
  ],
  'Elegant & High-End': [
    'Cormorant Garamond',
    'DM Serif Display',
    'Playfair Display',
    'Lora',
    'Gloock'
  ],
  'Professional & Versatile': [
    'Source Sans Pro',
    'Open Sans',
    'Poppins',
    'Raleway',
    'Roboto'
  ],
  'Retro & Character-Rich': [
    'Barlow Condensed',
    'Rokkitt',
    'Alfa Slab One',
    'Press Start 2P',
    'Chivo'
  ]
};

function determineAestheticStyle(scores: UserScores): string {
  const { tone, energy, design, era, structure } = scores;

  // Classic Editorial
  if (tone <= 2 && energy <= 2 && design <= 3 && era <= 2) {
    return 'Classic Editorial';
  }

  // Modern & Minimal
  if (design <= 2 && era >= 4 && structure >= 4) {
    return 'Modern & Minimal';
  }

  // Friendly & Playful
  if (tone >= 4 && energy >= 3 && structure <= 3) {
    return 'Friendly & Playful';
  }

  // Elegant & High-End
  if (tone <= 2 && design >= 3 && era <= 3) {
    return 'Elegant & High-End';
  }

  // Retro & Character-Rich
  if (design >= 4 && era <= 3) {
    return 'Retro & Character-Rich';
  }

  // Default to Professional & Versatile
  return 'Professional & Versatile';
}

function getFontsForStyle(style: string): FontData[] {
  const whitelist = AESTHETIC_WHITELISTS[style];
  if (!whitelist) return [];

  return fonts
    .filter(font => whitelist.includes(font.name))
    .sort((a, b) => {
      const aIndex = whitelist.indexOf(a.name);
      const bIndex = whitelist.indexOf(b.name);
      return aIndex - bIndex;
    });
}

function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const matchingFonts = getFontsForStyle(aestheticStyle);

  if (matchingFonts.length === 0) {
    throw new Error(`No fonts found for style: ${aestheticStyle}`);
  }

  return {
    aestheticStyle,
    primary: matchingFonts[0],
    secondary: matchingFonts[1] || matchingFonts[0],
    tertiary: matchingFonts[2] || matchingFonts[1] || matchingFonts[0]
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