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
  'Humanist Sans': {
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
  'Geometric Sans': {
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
  'Condensed Sans': {
    toneMin: 3,
    toneMax: 4,
    energyMin: 4,
    energyMax: 5,
    designMin: 4,
    designMax: 5,
    eraMin: 3,
    eraMax: 4,
    structureMin: 4,
    structureMax: 5
  },
  'Monospace': {
    toneMin: 2,
    toneMax: 3,
    energyMin: 1,
    energyMax: 3,
    designMin: 1,
    designMax: 3,
    eraMin: 4,
    eraMax: 5,
    structureMin: 4,
    structureMax: 5
  },
  'Rounded Sans': {
    toneMin: 3,
    toneMax: 5,
    energyMin: 3,
    energyMax: 5,
    designMin: 3,
    designMax: 4,
    eraMin: 4,
    eraMax: 5,
    structureMin: 2,
    structureMax: 3
  }
};