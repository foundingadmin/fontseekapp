import React from 'react';
import { useQuizStore } from '../store/quizStore';
import { RadarChart } from './RadarChart';
import { TraitScales } from './TraitScales';
import { ContactForm } from './ContactForm';
import { generateFontReport } from '../utils/pdfGenerator';

export const QuizResults: React.FC = () => {
  const { scores, recommendations, topTraits } = useQuizStore();

  const handleDownloadPDF = async () => {
    await generateFontReport({
      scores,
      recommendations,
      topTraits
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Font Personality Results</h1>
        <p className="text-lg text-white/80">
          Based on your responses, here's a detailed analysis of your typography preferences
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 space-y-8">
        <RadarChart scores={scores} />
        <TraitScales scores={scores} />
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8">
        <ContactForm onDownloadPDF={handleDownloadPDF} />
      </div>
    </div>
  );
};