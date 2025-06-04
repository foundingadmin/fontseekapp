const styleDisplayNames: Record<string, string> = {
  'Geometric Sans': 'Modern & Minimal',
  'Humanist Sans': 'Warm & Approachable',
  'Rounded Sans': 'Friendly & Playful',
  'System Default': 'Universal & Neutral',
  'Transitional Serif': 'Classic & Credible',
  'Slab Serif': 'Structured & Professional',
  'Old Style Serif': 'Elegant & Literary',
  'Display / Bubbly': 'Bold & Expressive',
  'Classic Editorial': 'Classic Editorial',
  'Modern Sans-Serif': 'Modern & Minimal',
  'Modern Serif': 'Classic & Credible'
};

export const aestheticDescriptions: Record<string, { emoji: string; description: string }> = {
  'Modern & Minimal': {
    emoji: '⚡',
    description: 'Your brand radiates contemporary sophistication with clean, minimal aesthetics that speak to modern sensibilities.'
  },
  'Warm & Approachable': {
    emoji: '🤝',
    description: 'Your brand connects through friendly, approachable design that puts people at ease and builds trust.'
  },
  'Friendly & Playful': {
    emoji: '🎨',
    description: 'Your brand brings joy through playful, engaging design that makes people smile.'
  },
  'Universal & Neutral': {
    emoji: '🌐',
    description: 'Your brand maintains clarity and accessibility with a balanced, universal approach.'
  },
  'Classic & Credible': {
    emoji: '📚',
    description: 'Your brand commands respect through timeless design that speaks to tradition and expertise.'
  },
  'Structured & Professional': {
    emoji: '💼',
    description: 'Your brand projects confidence through structured, professional design that means business.'
  },
  'Elegant & Literary': {
    emoji: '✒️',
    description: 'Your brand tells stories through refined, sophisticated design with a literary touch.'
  },
  'Bold & Expressive': {
    emoji: '💫',
    description: 'Your brand makes a statement through bold, expressive design that demands attention.'
  },
  'Classic Editorial': {
    emoji: '📰',
    description: 'Your brand communicates with authority through refined typography and editorial sophistication.'
  }
};

export function getDisplayName(internalName: string): string {
  return styleDisplayNames[internalName] || internalName;
}

export function getInternalName(displayName: string): string {
  const entry = Object.entries(styleDisplayNames).find(([_, display]) => display === displayName);
  return entry ? entry[0] : displayName;
}