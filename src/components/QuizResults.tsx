import React from 'react';
import { useQuizStore } from '../store/quizStore';
import { RadarChart } from './RadarChart';
import { TraitScales } from './TraitScales';
import { ContactForm } from './ContactForm';

export function QuizResults() {
  const { answers } = useQuizStore();

  return (
    <div className="space-y-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Your Font Personality Results</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6">
            <RadarChart />
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6">
            <TraitScales />
          </div>
        </div>

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}