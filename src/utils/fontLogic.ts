import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';
import { aestheticScoring } from '../data/aestheticScoring';

// Grotesque Sans default fonts
const grotesqueSansFonts: FontData[] = [
  {
    name: 'Chivo',
    googleFontsLink: 'https://fonts.google.com/specimen/Chivo',
    tone: 3,
    energy: 3,
    design: 2,
    era: 5,
    structure: 4,
    aestheticStyle: 'Grotesque Sans',
    embedCode: "Chivo', sans-serif",
    personalityTags: ['Neutral', 'Technical', 'Contemporary'],
    recommendedFor: ['SaaS', 'News', 'Product Design']
  },
  {
    name: 'Work Sans',
    googleFontsLink: 'https://fonts.google.com/specimen/Work+Sans',
    tone: 3,
    energy: 3,
    design: 2,
    era: 5,
    structure: 4,
    aestheticStyle: 'Grotesque Sans',
    embedCode: "Work Sans', sans-serif",
    personalityTags: ['Versatile', 'Clean', 'Balanced'],
    recommendedFor: ['Startups', 'Content', 'Marketing']
  },
  {
    name: 'Barlow',
    googleFontsLink: 'https://fonts.google.com/specimen/Barlow',
    tone: 3,
    energy: 4,
    design: 3,
    era: 5,
    structure: 5,
    aestheticStyle: 'Grotesque Sans',
    embedCode: "Barlow', sans-serif",
    personalityTags: ['Neutral', 'Clean', 'Versatile'],
    recommendedFor: ['Corporate', 'SaaS']
  }
];

// Humanist Sans fallback fonts
const humanistSansFonts: FontData[] = [
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
    name: 'PT Sans',
    googleFontsLink: 'https://fonts.google.com/specimen/PT+Sans',
    tone: 3,
    energy: 2,
    design: 2,
    era: 3,
    structure: 4,
    aestheticStyle: 'Humanist Sans',
    embedCode: "PT Sans', sans-serif",
    personalityTags: ['Open', 'Versatile', 'Professional'],
    recommendedFor: ['Publishing', 'Web', 'Service']
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
  // Check for Grotesque Sans first
  const lowScores = [scores.tone, scores.energy, scores.design, scores.era].filter(s => s <= 2).length;
  if (scores.structure === 3 && lowScores >= 3) {
    return 'Grotesque Sans';
  }

  // Check other styles based on scoring ranges
  for (const [style, ranges] of Object.entries(aestheticScoring)) {
    const isMatch = 
      scores.tone >= ranges.toneMin && scores.tone <= ranges.toneMax &&
      scores.energy >= ranges.energyMin && scores.energy <= ranges.energyMax &&
      scores.design >= ranges.designMin && scores.design <= ranges.designMax &&
      scores.era >= ranges.eraMin && scores.era <= ranges.eraMax &&
      scores.structure >= ranges.structureMin && scores.structure <= ranges.structureMax;

    if (isMatch) {
      return style;
    }
  }

  // Default to Humanist Sans if no clear match
  return 'Humanist Sans';
}

function getMatchingFonts(aestheticStyle: string): FontData[] {
  try {
    if (aestheticStyle === 'Grotesque Sans') {
      return grotesqueSansFonts;
    }

    const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);
    
    if (matchingFonts.length === 0) {
      console.warn(`No fonts found for style '${aestheticStyle}'. Falling back to Humanist Sans.`);
      return humanistSansFonts;
    }
    
    return matchingFonts;
  } catch (error) {
    console.warn('Error finding matching fonts:', error);
    return humanistSansFonts;
  }
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const matchingFonts = getMatchingFonts(aestheticStyle);
  
  // If we don't have enough fonts, use fallbacks
  if (matchingFonts.length < 3) {
    console.warn(`Not enough fonts found for style '${aestheticStyle}'. Using fallbacks to complete the set.`);
    return {
      primary: humanistSansFonts[0],
      secondary: humanistSansFonts[1],
      tertiary: humanistSansFonts[2],
      aestheticStyle: 'Humanist Sans'
    };
  }
  
  return {
    primary: matchingFonts[0],
    secondary: matchingFonts[1],
    tertiary: matchingFonts[2],
    aestheticStyle
  };
}