interface AestheticRange {
  toneMin: number;
  toneMax: number;
  energyMin: number;
  energyMax: number;
  designMin: number;
  designMax: number;
  eraMin: number;
  eraMax: number;
  structureMin: number;
  structureMax: number;
}

interface AestheticScoring {
  [key: string]: AestheticRange;
}

export const aestheticScoring: AestheticScoring = {
  'Modern & Minimal': {
    toneMin: 2,
    toneMax: 4,
    energyMin: 2,
    energyMax: 4,
    designMin: 1,
    designMax: 3,
    eraMin: 4,
    eraMax: 5,
    structureMin: 4,
    structureMax: 5
  },
  'Warm & Approachable': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 2,
    energyMax: 4,
    designMin: 2,
    designMax: 4,
    eraMin: 3,
    eraMax: 4,
    structureMin: 2,
    structureMax: 4
  },
  'Bold & Expressive': {
    toneMin: 4,
    toneMax: 5,
    energyMin: 4,
    energyMax: 5,
    designMin: 4,
    designMax: 5,
    eraMin: 3,
    eraMax: 5,
    structureMin: 2,
    structureMax: 4
  },
  'Classic & Credible': {
    toneMin: 1,
    toneMax: 3,
    energyMin: 1,
    energyMax: 3,
    designMin: 2,
    designMax: 3,
    eraMin: 1,
    eraMax: 3,
    structureMin: 2,
    structureMax: 4
  },
  'Elegant & Literary': {
    toneMin: 1,
    toneMax: 3,
    energyMin: 1,
    energyMax: 3,
    designMin: 3,
    designMax: 5,
    eraMin: 1,
    eraMax: 3,
    structureMin: 2,
    structureMax: 4
  },
  'Structured & Professional': {
    toneMin: 2,
    toneMax: 4,
    energyMin: 2,
    energyMax: 4,
    designMin: 2,
    designMax: 4,
    eraMin: 3,
    eraMax: 5,
    structureMin: 3,
    structureMax: 5
  },
  'Universal & Neutral': {
    toneMin: 2,
    toneMax: 4,
    energyMin: 2,
    energyMax: 4,
    designMin: 1,
    designMax: 3,
    eraMin: 3,
    eraMax: 5,
    structureMin: 3,
    structureMax: 5
  }
};