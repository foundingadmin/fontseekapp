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
  'Geometric Sans': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 3,
    energyMax: 5,
    designMin: 4,
    designMax: 5,
    eraMin: 4,
    eraMax: 5,
    structureMin: 5,
    structureMax: 5
  },
  'Grotesque Sans': {
    toneMin: 1,
    toneMax: 3,
    energyMin: 2,
    energyMax: 4,
    designMin: 1,
    designMax: 3,
    eraMin: 4,
    eraMax: 5,
    structureMin: 3,
    structureMax: 4
  },
  'Humanist Sans': {
    toneMin: 4,
    toneMax: 5,
    energyMin: 2,
    energyMax: 4,
    designMin: 3,
    designMax: 3,
    eraMin: 2,
    eraMax: 4,
    structureMin: 1,
    structureMax: 3
  },
  'Rounded Sans': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 3,
    energyMax: 5,
    designMin: 3,
    designMax: 5,
    eraMin: 3,
    eraMax: 5,
    structureMin: 1,
    structureMax: 1
  },
  'Display / Bubbly': {
    toneMin: 5,
    toneMax: 5,
    energyMin: 5,
    energyMax: 5,
    designMin: 5,
    designMax: 5,
    eraMin: 3,
    eraMax: 5,
    structureMin: 1,
    structureMax: 2
  },
  'Monospace': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 2,
    energyMax: 4,
    designMin: 1,
    designMax: 3,
    eraMin: 3,
    eraMax: 5,
    structureMin: 5,
    structureMax: 5
  },
  'Serif Old Style': {
    toneMin: 1,
    toneMax: 2,
    energyMin: 1,
    energyMax: 3,
    designMin: 1,
    designMax: 3,
    eraMin: 1,
    eraMax: 2,
    structureMin: 3,
    structureMax: 5
  },
  'Transitional Serif': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 2,
    energyMax: 4,
    designMin: 2,
    designMax: 4,
    eraMin: 3,
    eraMax: 3,
    structureMin: 3,
    structureMax: 5
  },
  'Modern Serif': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 3,
    energyMax: 5,
    designMin: 4,
    designMax: 5,
    eraMin: 4,
    eraMax: 5,
    structureMin: 3,
    structureMax: 5
  }
};