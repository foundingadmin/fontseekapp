export interface QuizQuestion {
  questionNumber: number;
  traitAxis: string;
  question: string;
  optionA: string;
  optionAScore: number;
  optionB: string;
  optionBScore: number;
}

export interface FontData {
  name: string;
  googleFontsLink: string;
  tone: number;
  energy: number;
  design: number;
  era: number;
  structure: number;
  aestheticStyle: string;
  embedCode: string;
  personalityTags: string[];
  recommendedFor: string[];
}

export interface UserScores {
  tone: number;
  energy: number;
  design: number;
  era: number;
  structure: number;
}

export interface FontRecommendation {
  primary: FontData;
  secondary: FontData;
  tertiary: FontData;
  aestheticStyle: string;
}