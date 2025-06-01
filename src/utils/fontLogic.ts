import type { UserScores, FontRecommendation, FontData } from '../types';
import { fonts } from '../data/fonts';

// Default fallback fonts for each category
const fallbackFonts: Record<string, FontData[]> = {
  'Transitional Serif': [
    {
      name: 'Georgia',
      googleFontsLink: '',
      tone: 2,
      energy: 2,
      design: 3,
      era: 3,
      structure: 2,
      aestheticStyle: 'Transitional Serif',
      embedCode: 'Georgia, serif',
      personalityTags: ['Classic', 'Readable', 'Professional'],
      recommendedFor: ['General Use', 'Editorial']
    }
  ],
  'System': [
    {
      name: 'System UI',
      googleFontsLink: '',
      tone: 3,
      energy: 3,
      design: 3,
      era: 4,
      structure: 3,
      aestheticStyle: 'System',
      embedCode: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      personalityTags: ['Clean', 'Universal', 'Reliable'],
      recommendedFor: ['Any Context']
    }
  ]
};

function determineAestheticStyle(scores: UserScores): string {
  // Transitional Serif: balanced scores with traditional lean
  if (scores.tone <= 3 && scores.energy <= 3 && scores.design === 3) {
    return 'Transitional Serif';
  }
  
  // Display / Bubbly: high energy, design, and tone with low structure
  if (scores.energy >= 4 && scores.design >= 4 && scores.tone >= 4 && scores.structure <= 2) {
    return 'Display / Bubbly';
  }
  
  // Rest of existing style determinations...
  if (scores.structure === 5 && scores.design <= 2) {
    return 'Monospace';
  }
  
  if (scores.tone <= 2 && scores.energy <= 2 && scores.era <= 2) {
    return 'Classic Serif';
  }
  
  if (scores.structure >= 4 && scores.tone <= 3) {
    return 'Condensed Sans';
  }
  
  const isNeutral = Object.values(scores).every(score => score >= 2 && score <= 4);
  if (isNeutral) {
    return 'Grotesque Sans';
  }
  
  if (scores.structure === 5 && scores.design >= 4) {
    return 'Geometric Sans';
  }
  
  if (scores.tone >= 4 && scores.design === 3 && scores.structure <= 3) {
    return 'Humanist Sans';
  }
  
  // Default to Grotesque Sans if no clear match
  return 'Grotesque Sans';
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getFallbackFonts(aestheticStyle: string): FontData[] {
  // Return specific fallbacks for the style if available
  if (fallbackFonts[aestheticStyle]) {
    return fallbackFonts[aestheticStyle];
  }
  // Otherwise return system fonts
  return fallbackFonts['System'];
}

function getRandomFonts(aestheticStyle: string): FontData[] {
  // Get all fonts matching the aesthetic style
  const matchingFonts = fonts.filter(font => font.aestheticStyle === aestheticStyle);
  
  // If no matching fonts found, use fallbacks
  if (matchingFonts.length === 0) {
    console.warn(`No fonts found for aesthetic style: ${aestheticStyle}. Using fallbacks.`);
    return getFallbackFonts(aestheticStyle);
  }
  
  // If we have exactly 3 fonts, shuffle them
  if (matchingFonts.length === 3) {
    return shuffleArray([...matchingFonts]);
  }
  
  // If we have more than 3 fonts, return 3 random ones
  if (matchingFonts.length > 3) {
    return shuffleArray([...matchingFonts]).slice(0, 3);
  }
  
  // If we have fewer than 3 fonts, fill with alternatives
  const result = [...matchingFonts];
  const remainingCount = 3 - result.length;
  
  if (remainingCount > 0) {
    // First try to fill with fallbacks for this style
    const styleFallbacks = getFallbackFonts(aestheticStyle);
    result.push(...styleFallbacks.slice(0, remainingCount));
    
    // If we still need more, use fonts from other styles
    if (result.length < 3) {
      const otherFonts = fonts.filter(font => 
        font.aestheticStyle !== aestheticStyle &&
        !result.some(r => r.name === font.name)
      );
      
      const alternatives = shuffleArray(otherFonts).slice(0, 3 - result.length);
      result.push(...alternatives);
    }
  }
  
  return result;
}

export function calculateFontRecommendations(scores: UserScores): FontRecommendation {
  const aestheticStyle = determineAestheticStyle(scores);
  const [primary, secondary, tertiary] = getRandomFonts(aestheticStyle);
  
  return {
    primary,
    secondary,
    tertiary,
    aestheticStyle
  };
}