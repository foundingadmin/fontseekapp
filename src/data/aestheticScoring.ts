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
    energyMax: 2,
    designMin: 1,
    designMax: 2,
    eraMin: 1,
    eraMax: 2,
    structureMin: 1,
    structureMax: 3
  },
  'Grotesque Sans': {
    toneMin: 2,
    toneMax: 4,
    energyMin: 2,
    energyMax: 4,
    designMin: 2,
    designMax: 4,
    eraMin: 3,
    eraMax: 4,
    structureMin: 3,
    structureMax: 4
  },
  'Humanist Sans': {
    toneMin: 4,
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
    energyMax: 4,
    designMin: 2,
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
    designMin: 3,
    designMax: 5,
    eraMin: 4,
    eraMax: 5,
    structureMin: 4,
    structureMax: 5
  }
};