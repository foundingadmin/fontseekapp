import { create } from 'zustand';
import type { QuizQuestion, UserScores, FontRecommendation } from '../types';
import { quizQuestions } from '../data/quiz';
import { calculateFontRecommendations, getTopTraits } from '../utils/fontLogic';
import { fonts } from '../data/fonts';

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
  skipToResults: () => void;
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

    // Only calculate results if this is the last question
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

    // Calculate scores from answers
    Object.entries(answers).forEach(([questionNum, answer]) => {
      const question = quizQuestions[parseInt(questionNum) - 1];
      const score = answer === 'A' ? question.optionAScore : question.optionBScore;
      
      switch (question.traitAxis.toLowerCase()) {
        case 'tone':
          scores.tone = score;
          break;
        case 'energy':
          scores.energy = score;
          break;
        case 'design':
          scores.design = score;
          break;
        case 'era':
          scores.era = score;
          break;
        case 'structure':
          scores.structure = score;
          break;
      }
    });

    try {
      const recommendations = calculateFontRecommendations(scores);
      const topTraits = getTopTraits(scores);
      
      set({ scores, recommendations, topTraits });
    } catch (error) {
      console.error('Error calculating recommendations:', error);
      // Set default recommendations if calculation fails
      set({ 
        scores,
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
    // Fill in any unanswered questions with default 'A' answers
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