import React from 'react';
import { Info } from 'lucide-react';
import { UserScores } from '../types';
import { useQuizStore } from '../store/quizStore';

interface TraitScalesProps {
  scores: UserScores;
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Brand Personality</h2>
        <p className="text-white/60">
          This chart shows how your brand expresses itself across 5 key personality traits based on your answers.
        </p>
      </div>

      <div className="space-y-4">
        {(Object.keys(traits) as Array<keyof UserScores>).map((traitKey, index) => {
          const trait = traits[traitKey];
          const score = visualScores[traitKey];
          const percentage = ((score - 1) / 4) * 100;

          return (
            <div key={traitKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{trait.label}</h3>
                <div className="group relative">
                  <Info className="w-4 h-4 text-white/40 hover:text-white/60 cursor-help" />
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/90 text-xs text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {trait.description}
                  </div>
                </div>
              </div>

              <div className="relative h-12">
                {/* Labels */}
                <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-white/60">
                  <span>{trait.leftLabel}</span>
                  <span>{trait.rightLabel}</span>
                </div>

                {/* Track and marker container */}
                <div className="absolute left-0 right-0 top-1/2 mt-2">
                  {/* Track background with tick marks */}
                  <div className="absolute left-0 right-0 h-0.5 bg-neutral-700 rounded-full">
                    {[0, 25, 50, 75, 100].map((tick) => (
                      <div
                        key={tick}
                        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/10"
                        style={{ left: `${tick}%` }}
                      />
                    ))}
                    
                    {/* Progress bar */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-emerald-400/10 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {/* Marker */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-400 rounded-full transition-all duration-700 ease-out z-10"
                    style={{ 
                      left: `${percentage}%`,
                      transform: 'translate(-50%, -50%)',
                      animation: `
                        marker-glow-${index + 1} 2s ease-in-out infinite,
                        fade-in 0.5s ease-out forwards
                      `,
                      animationDelay: `${index * 0.1}s`
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