import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

// Default Humanist Sans fallback fonts
const fallbackFonts: FontData[] = [
  {
    name: 'Karla',
    googleFontsLink: 'https://fonts.google.com/specimen/Karla',
    tone: 4,
    energy: 2,
    design: 2,
    era: 4,
    structure: 3,
    aestheticStyle: 'Humanist Sans',
    embedCode: "Karla', sans-serif",
    personalityTags: ['Friendly', 'Approachable', 'Humanist'],
    recommendedFor: ['DTC', 'Services']
  },
  {
    name: 'Work Sans',
    googleFontsLink: 'https://fonts.google.com/specimen/Work+Sans',
    tone: 3,
    energy: 3,
    design: 2,
    era: 5,
    structure: 4,
    aestheticStyle: 'Humanist Sans',
    embedCode: "Work Sans', sans-serif",
    personalityTags: ['Versatile', 'Clean', 'Balanced'],
    recommendedFor: ['Startups', 'Content', 'Marketing']
  },
  {
    name: 'Cabin',
    googleFontsLink: 'https://fonts.google.com/specimen/Cabin',
    tone: 3,
    energy: 3,
    design: 3,
    era: 4,
    structure: 3,
    aestheticStyle: 'Humanist Sans',
    embedCode: "Cabin', sans-serif",
    personalityTags: ['Warm', 'Friendly', 'Contemporary'],
    recommendedFor: ['Startups', 'Nonprofits', 'Content']
  }
];

function determineAestheticStyle(scores: UserScores): string {
  // Existing style determination logic...
  if (scores.structure === 5 && scores.design <= 2) {
    return 'Monospace';
  }
  
  if (scores.tone <= 2 && scores.energy <= 2 && scores.era <= 2) {
    return 'Classic Serif';
  }
  
  if (scores.structure >= 4 && scores.tone <= 3) {
    return 'Condensed Sans';
  }
  
  if (scores.structure === 5 && scores.design >= 4) {
    return 'Geometric Sans';
  }
  
  // Default to Humanist Sans if no clear match
  return 'Humanist Sans';
}

function getMatchingFonts(aestheticStyle: string): FontData[] {
  try {
    const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);
    
    if (matchingFonts.length === 0) {
      console.warn(`No fonts found for style '${aestheticStyle}'. Falling back to Humanist Sans.`);
      return fallbackFonts;
    }
    
    return matchingFonts;
  } catch (error) {
    console.warn('Error finding matching fonts:', error);
    return fallbackFonts;
  }
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const matchingFonts = getMatchingFonts(aestheticStyle);
  
  // If we don't have enough fonts, use fallbacks
  if (matchingFonts.length < 3) {
    console.warn(`Not enough fonts found for style '${aestheticStyle}'. Using fallbacks to complete the set.`);
    return {
      primary: fallbackFonts[0],
      secondary: fallbackFonts[1],
      tertiary: fallbackFonts[2],
      aestheticStyle: 'Humanist Sans'
    };
  }
  
  // Randomize the order of matching fonts
  const shuffled = [...matchingFonts].sort(() => Math.random() - 0.5);
  
  return {
    primary: shuffled[0],
    secondary: shuffled[1],
    tertiary: shuffled[2],
    aestheticStyle
  };
}