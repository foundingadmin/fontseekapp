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
  'Serif Old Style': {
    toneMin: 1,
    toneMax: 2,
    energyMin: 1,
    energyMax: 3,
    designMin: 1,
    designMax: 2,
    eraMin: 1,
    eraMax: 2,
    structureMin: 1,
    structureMax: 3
  },
  'Display / Bubbly': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 4,
    energyMax: 5,
    designMin: 4,
    designMax: 5,
    structureMin: 1,
    structureMax: 3,
    eraMin: 3,
    eraMax: 5
  },
  'Monospace': {
    toneMin: 1,
    toneMax: 3,
    energyMin: 1,
    energyMax: 3,
    designMin: 1,
    designMax: 2,
    eraMin: 3,
    eraMax: 5,
    structureMin: 4,
    structureMax: 5
  },
  'Condensed Sans': {
    toneMin: 2,
    toneMax: 3,
    energyMin: 3,
    energyMax: 5,
    designMin: 2,
    designMax: 3,
    eraMin: 3,
    eraMax: 5,
    structureMin: 4,
    structureMax: 5
  },
  'Humanist Sans': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 2,
    energyMax: 4,
    designMin: 2,
    designMax: 3,
    eraMin: 3,
    eraMax: 4,
    structureMin: 2,
    structureMax: 3
  },
  'Geometric Sans': {
    toneMin: 2,
    toneMax: 4,
    energyMin: 3,
    energyMax: 5,
    designMin: 3,
    designMax: 5,
    eraMin: 3,
    eraMax: 5,
    structureMin: 4,
    structureMax: 5
  },
  'Rounded Sans': {
    toneMin: 4,
    toneMax: 5,
    energyMin: 3,
    energyMax: 4,
    designMin: 2,
    designMax: 4,
    eraMin: 3,
    eraMax: 5,
    structureMin: 1,
    structureMax: 3
  }
};