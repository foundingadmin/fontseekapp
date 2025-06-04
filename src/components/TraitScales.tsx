import React from 'react';
import { Info } from 'lucide-react';
import { UserScores } from '../types';
import { useQuizStore } from '../store/quizStore';

interface TraitScalesProps {
  scores: UserScores;
}

interface TraitDefinition {
  label: string;
  leftLabel: string;
  rightLabel: string;
  description: string;
}

const traits: Record<keyof UserScores, TraitDefinition> = {
  tone: {
    label: 'Tone',
    leftLabel: 'Formal',
    rightLabel: 'Casual',
    description: 'Your brand voice — formal or casual'
  },
  energy: {
    label: 'Energy',
    leftLabel: 'Calm',
    rightLabel: 'Energetic',
    description: 'Brand intensity — calm or energetic'
  },
  design: {
    label: 'Design',
    leftLabel: 'Minimal',
    rightLabel: 'Expressive',
    description: 'Visual styling — minimal or expressive'
  },
  era: {
    label: 'Era',
    leftLabel: 'Classic',
    rightLabel: 'Modern',
    description: 'Timelessness — classic or modern'
  },
  structure: {
    label: 'Structure',
    leftLabel: 'Organic',
    rightLabel: 'Geometric',
    description: 'Shape language — organic or geometric'
  }
};

export const TraitScales: React.FC<TraitScalesProps> = () => {
  const visualScores = useQuizStore(state => state.visualScores);

  if (!visualScores) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Brand Personality</h2>
        <p className="text-white/60">
          This chart shows how your brand expresses itself across 5 key personality traits based on your answers.
        </p>
      </div>

      <div className="space-y-6">
        {(Object.keys(traits) as Array<keyof UserScores>).map((traitKey) => {
          const trait = traits[traitKey];
          const score = visualScores[traitKey];
          const percentage = ((score - 1) / 4) * 100;

          return (
            <div key={traitKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{trait.label}</h3>
                <div className="group relative">
                  <Info className="w-4 h-4 text-white/40 hover:text-white/60 cursor-help" />
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/90 text-xs text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {trait.description}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between text-xs text-white/60 mb-1.5">
                  <span>{trait.leftLabel}</span>
                  <span>{trait.rightLabel}</span>
                </div>

                <div className="h-2 bg-neutral-700 rounded-full relative overflow-hidden">
                  {/* Background tick marks */}
                  {[0, 25, 50, 75, 100].map((tick) => (
                    <div
                      key={tick}
                      className="absolute top-0 bottom-0 w-0.5 bg-white/10"
                      style={{ left: `${tick}%` }}
                    />
                  ))}
                  
                  {/* Animated progress bar */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-emerald-400/10 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                  
                  {/* Animated indicator dot with glow effect */}
                  <div 
                    className="absolute top-1/2 w-6 h-6 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(67,218,122,0.5)] transition-all duration-700 ease-out opacity-0 animate-fade-in"
                    style={{ 
                      left: `${percentage}%`,
                      transform: `translate(-50%, -50%) scale(${score === 3 ? '0.9' : '1'})`,
                      animation: 'fade-in 0.5s ease-out forwards, slide-in 0.7s ease-out forwards'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};