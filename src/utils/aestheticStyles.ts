const styleDisplayNames: Record<string, string> = {
  'Geometric Sans': 'Modern & Minimal',
  'Humanist Sans': 'Warm & Approachable',
  'Rounded Sans': 'Friendly & Playful',
  'System Default': 'Universal & Neutral',
  'Transitional Serif': 'Classic & Credible',
  'Slab Serif': 'Structured & Professional',
  'Old Style Serif': 'Elegant & Literary',
  'Display / Bubbly': 'Bold & Expressive'
};

export function getDisplayName(internalName: string): string {
  return styleDisplayNames[internalName] || internalName;
}

export function getInternalName(displayName: string): string {
  const entry = Object.entries(styleDisplayNames).find(([_, display]) => display === displayName);
  return entry ? entry[0] : displayName;
}