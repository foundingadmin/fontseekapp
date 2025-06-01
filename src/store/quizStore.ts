import { create } from 'zustand';
import type { QuizQuestion, UserScores, FontRecommendation } from '../types';
import { quizQuestions } from '../data/quiz';
import { calculateFontRecommendations } from '../utils/fontLogic';

interface QuizStore {
  currentQuestion: number;
  answers: Record<number, 'A' | 'B'>;
  scores: UserScores | null;
  recommendations: FontRecommendation | null;
  setAnswer: (questionNumber: number, answer: 'A' | 'B') => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  calculateResults: () => void;
  resetQuiz: () => void;
  skipToResults: () => void;
}

const generateRandomScores = (): UserScores => ({
  tone: Math.floor(Math.random() * 5) + 1,
  energy: Math.floor(Math.random() * 5) + 1,
  design: Math.floor(Math.random() * 5) + 1,
  era: Math.floor(Math.random() * 5) + 1,
  structure: Math.floor(Math.random() * 5) + 1,
});

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuestion: 1,
  answers: {},
  scores: null,
  recommendations: null,

  setAnswer: (questionNumber, answer) => {
    set((state) => ({
      answers: { ...state.answers, [questionNumber]: answer }
    }));

    // If this was the last question, calculate results immediately
    if (questionNumber === quizQuestions.length) {
      setTimeout(() => get().calculateResults(), 500);
    } else {
      setTimeout(() => get().nextQuestion(), 500);
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
      set({ currentQuestion: current - 1 });
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

    // Calculate scores based on answers
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
  }
}));