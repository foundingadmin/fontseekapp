import { create } from 'zustand';
import type { QuizQuestion, UserScores, FontRecommendation } from '../types';
import { quizQuestions } from '../data/quiz';
import { calculateFontRecommendations, getTopTraits } from '../utils/fontLogic';
import { fonts } from '../data/fonts';

interface QuizStore {
  currentQuestion: number;
  answers: Record<number, 'A' | 'B'>;
  scores: UserScores | null;
  visualScores: UserScores | null;
  recommendations: FontRecommendation | null;
  topTraits: string[];
  email: string | null;
  hasStarted: boolean;
  setAnswer: (questionNumber: number, answer: 'A' | 'B') => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  calculateResults: () => void;
  resetQuiz: () => void;
  startQuiz: (email: string) => void;
  skipToResults: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuestion: 1,
  answers: {},
  scores: null,
  visualScores: null,
  recommendations: null,
  topTraits: [],
  email: null,
  hasStarted: false,

  setAnswer: (questionNumber, answer) => {
    set((state) => ({
      answers: { ...state.answers, [questionNumber]: answer }
    }));

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
      set({ 
        currentQuestion: current - 1,
        scores: null,
        visualScores: null,
        recommendations: null,
        topTraits: []
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
    
    const visualScores: UserScores = {
      tone: 0,
      energy: 0,
      design: 0,
      era: 0,
      structure: 0
    };

    // Calculate trait counts for each axis
    const traitCounts: Record<string, { A: number, B: number }> = {
      tone: { A: 0, B: 0 },
      energy: { A: 0, B: 0 },
      design: { A: 0, B: 0 },
      era: { A: 0, B: 0 },
      structure: { A: 0, B: 0 }
    };

    // Count answers for each trait
    Object.entries(answers).forEach(([questionNum, answer]) => {
      const question = quizQuestions[parseInt(questionNum) - 1];
      const trait = question.traitAxis.toLowerCase();
      traitCounts[trait][answer]++;
    });

    // Calculate scores for aesthetic matching (binary)
    Object.entries(traitCounts).forEach(([trait, count]) => {
      const total = count.A + count.B;
      scores[trait as keyof UserScores] = count.B > count.A ? 5 : 1;
      
      // Calculate granular scores for visualization (1-5 scale)
      const bPercentage = (count.B / total) * 100;
      let visualScore = 1;
      if (bPercentage >= 87.5) visualScore = 5;
      else if (bPercentage >= 62.5) visualScore = 4;
      else if (bPercentage >= 37.5) visualScore = 3;
      else if (bPercentage >= 12.5) visualScore = 2;
      visualScores[trait as keyof UserScores] = visualScore;
    });

    try {
      const recommendations = calculateFontRecommendations(scores);
      const topTraits = getTopTraits(scores);
      
      set({ scores, visualScores, recommendations, topTraits });
    } catch (error) {
      console.error('Error calculating recommendations:', error);
      set({ 
        scores,
        visualScores,
        recommendations: {
          aestheticStyle: 'Modern & Minimal',
          primary: fonts[0],
          secondary: fonts[1],
          tertiary: fonts[2]
        },
        topTraits: ['Modern', 'Professional', 'Clean']
      });
    }
  },

  resetQuiz: () => {
    set({
      currentQuestion: 1,
      answers: {},
      scores: null,
      visualScores: null,
      recommendations: null,
      topTraits: []
    });
  },

  startQuiz: (email: string) => {
    set({
      email,
      hasStarted: true
    });
  },

  skipToResults: () => {
    const answers = { ...get().answers };
    for (let i = 1; i <= quizQuestions.length; i++) {
      if (!answers[i]) {
        answers[i] = 'A';
      }
    }
    
    set({ 
      answers,
      currentQuestion: quizQuestions.length
    });
    
    get().calculateResults();
  }
}));