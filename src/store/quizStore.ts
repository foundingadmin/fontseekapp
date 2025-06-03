import { create } from 'zustand';
import type { QuizQuestion, UserScores, FontRecommendation } from '../types';
import { quizQuestions } from '../data/quiz';
import { calculateFontRecommendations, getTopTraits } from '../utils/fontLogic';

interface QuizStore {
  currentQuestion: number;
  answers: Record<number, 'A' | 'B'>;
  scores: UserScores | null;
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
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuestion: 1,
  answers: {},
  scores: null,
  recommendations: null,
  topTraits: [],
  email: null,
  hasStarted: false,

  setAnswer: (questionNumber, answer) => {
    set((state) => ({
      answers: { ...state.answers, [questionNumber]: answer }
    }));

    const current = get().currentQuestion;
    
    // Calculate results if this is the last question
    if (current === quizQuestions.length) {
      setTimeout(() => {
        get().calculateResults();
      }, 0);
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

    // Calculate scores for each trait based on question pairs
    const questionPairs = {
      tone: [1, 6],
      energy: [2, 7],
      design: [3, 8],
      era: [4, 9],
      structure: [5, 10]
    };

    Object.entries(questionPairs).forEach(([trait, [q1, q2]]) => {
      const score1 = answers[q1] === 'A' ? 1 : 5;
      const score2 = answers[q2] === 'A' ? 1 : 5;
      scores[trait as keyof UserScores] = Math.round((score1 + score2) / 2);
    });

    try {
      const recommendations = calculateFontRecommendations(scores);
      const topTraits = getTopTraits(scores);
      
      set({ scores, recommendations, topTraits });
    } catch (error) {
      console.error('Error calculating recommendations:', error);
      set({ 
        scores: null,
        recommendations: null,
        topTraits: []
      });
    }
  },

  resetQuiz: () => {
    set({
      currentQuestion: 1,
      answers: {},
      scores: null,
      recommendations: null,
      topTraits: []
    });
  },

  startQuiz: (email: string) => {
    set({
      email,
      hasStarted: true
    });
  }
}));