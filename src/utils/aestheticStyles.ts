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
    description: 'Your brand resonates with clean, contemporary design principles that emphasize clarity and simplicity.'
  },
  'Warm & Approachable': {
    emoji: '🤝',
    description: 'Your brand personality connects through friendly, accessible design that puts people at ease.'
  },
  'Friendly & Playful': {
    emoji: '🎨',
    description: 'Your brand expresses itself through fun, engaging design that sparks joy and creativity.'
  },
  'Universal & Neutral': {
    emoji: '🌐',
    description: 'Your brand maintains versatility through balanced, adaptable design choices.'
  },
  'Classic & Credible': {
    emoji: '📚',
    description: 'Your brand carries authority through time-tested, sophisticated design elements.'
  },
  'Structured & Professional': {
    emoji: '💼',
    description: 'Your brand projects reliability through organized, business-focused design.'
  },
  'Elegant & Literary': {
    emoji: '✒️',
    description: 'Your brand tells stories through refined, cultured design choices.'
  },
  'Bold & Expressive': {
    emoji: '🎭',
    description: 'Your brand makes statements through dynamic, attention-grabbing design.'
  },
  'Classic Editorial': {
    emoji: '📰',
    description: 'Your brand communicates through traditional publishing-inspired design.'
  }
};

export function getDisplayName(internalName: string): string {
  return styleDisplayNames[internalName] || internalName;
}

export function getInternalName(displayName: string): string {
  const entry = Object.entries(styleDisplayNames).find(([_, display]) => display === displayName);
  return entry ? entry[0] : displayName;
}