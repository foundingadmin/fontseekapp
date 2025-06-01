import { create } from 'zustand';
import type { QuizQuestion, UserScores, FontRecommendation } from '../types';
import { quizQuestions } from '../data/quiz';
import { calculateFontRecommendations } from '../utils/fontLogic';

interface QuizStore {
  currentQuestion: number;
  answers: Record<number, 'A' | 'B'>;
  scores: UserScores | null;
  recommendations: FontRecommendation | null;
  email: string | null;
  hasStarted: boolean;
  setAnswer: (questionNumber: number, answer: 'A' | 'B') => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  calculateResults: () => void;
  resetQuiz: () => void;
  skipToResults: () => void;
  startQuiz: (email: string) => void;
}

// Keep track of recently used fonts to avoid repetition
const recentlyUsedFonts = new Set<string>();

const generateRandomScores = (): UserScores => {
  // Generate more diverse scores to get different font recommendations
  const getRandomScore = () => {
    const weights = [1, 2, 3, 4, 5];
    const randomIndex = Math.floor(Math.random() * weights.length);
    return weights[randomIndex];
  };

  return {
    tone: getRandomScore(),
    energy: getRandomScore(),
    design: getRandomScore(),
    era: getRandomScore(),
    structure: getRandomScore()
  };
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuestion: 1,
  answers: {},
  scores: null,
  recommendations: null,
  email: null,
  hasStarted: false,

  setAnswer: (questionNumber, answer) => {
    set((state) => ({
      answers: { ...state.answers, [questionNumber]: answer }
    }));

    // Only auto-advance and calculate if we're on the last question
    if (questionNumber === quizQuestions.length) {
      get().calculateResults();
    } else {
      get().nextQuestion();
    }
  },

  nextQuestion: () => {
    const current = get().currentQuestion;
    if (current < quizQuestions.length) {
      set({ currentQuestion: current + 1 });
    }
  },

  previousQuestion: () => {
    const current = get().currentQuestion;
    if (current > 1) {
      // Clear any existing recommendations when going back
      set({ 
        currentQuestion: current - 1,
        scores: null,
        recommendations: null
      });
    }
  },

  calculateResults: () => {
    const answers = get().answers;
    const scores: UserScores = {
      tone: 0,
      energy: 0,
      design: 0,
      era: 0,
      structure: 0
    };

    Object.entries(answers).forEach(([questionNum, answer]) => {
      const question = quizQuestions[parseInt(questionNum) - 1];
      const score = answer === 'A' ? question.optionAScore : question.optionBScore;
      
      switch (question.traitAxis.toLowerCase()) {
        case 'tone':
          scores.tone += score;
          break;
        case 'energy':
          scores.energy += score;
          break;
        case 'design':
          scores.design += score;
          break;
        case 'era':
          scores.era += score;
          break;
        case 'structure':
          scores.structure += score;
          break;
      }
    });

    // Average the scores for each trait
    Object.keys(scores).forEach((key) => {
      scores[key as keyof UserScores] = Math.round(scores[key as keyof UserScores] / 2);
    });

    const recommendations = calculateFontRecommendations(scores);
    
    // Update recently used fonts
    if (recommendations) {
      recentlyUsedFonts.add(recommendations.primary.name);
      recentlyUsedFonts.add(recommendations.secondary.name);
      recentlyUsedFonts.add(recommendations.tertiary.name);
      
      // Keep only the last 9 fonts (3 sets) in memory
      if (recentlyUsedFonts.size > 9) {
        const oldestFonts = Array.from(recentlyUsedFonts).slice(0, recentlyUsedFonts.size - 9);
        oldestFonts.forEach(font => recentlyUsedFonts.delete(font));
      }
    }
    
    set({ scores, recommendations });
  },

  resetQuiz: () => {
    set({
      currentQuestion: 1,
      answers: {},
      scores: null,
      recommendations: null
    });
  },

  skipToResults: () => {
    const randomScores = generateRandomScores();
    const recommendations = calculateFontRecommendations(randomScores);
    set({
      answers: { 1: 'A', 2: 'A', 3: 'A', 4: 'A', 5: 'A', 6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'A' },
      scores: randomScores,
      recommendations
    });
  },

  startQuiz: (email: string) => {
    set({
      email,
      hasStarted: true
    });
  }
}));