import React from 'react';
import { Info } from 'lucide-react';
import { UserScores } from '../types';

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

export const TraitScales: React.FC<TraitScalesProps> = ({ scores }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Your Brand's Font Personality Profile</h2>
        <p className="text-white/60">
          Based on your answers, these scales show how your brand expresses itself across five strategic traits.
        </p>
      </div>

      <div className="space-y-6">
        {(Object.keys(traits) as Array<keyof UserScores>).map((traitKey) => {
          const trait = traits[traitKey];
          const score = scores[traitKey];
          const percentage = ((score - 1) / 4) * 100; // Convert 1-5 score to 0-100%

          return (
            <div key={traitKey} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{trait.label}</h3>
                <div className="group relative">
                  <Info className="w-4 h-4 text-white/40 hover:text-white/60 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-xs text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {trait.description}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between text-xs text-white/60 mb-1.5">
                  <span>{trait.leftLabel}</span>
                  <span>{trait.rightLabel}</span>
                </div>

                {/* Track */}
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  {/* Indicator */}
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Marker dots */}
                <div className="absolute top-[calc(100%-0.375rem)] left-0 right-0 flex justify-between">
                  {[0, 1, 2, 3, 4].map((point) => (
                    <div 
                      key={point}
                      className={`w-1.5 h-1.5 rounded-full -mt-[3px] ${
                        point * 25 <= percentage ? 'bg-emerald-500' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-white/60">
          The position of each marker shows where your brand falls between two style extremes.
        </p>
      </div>
    </div>
  );
};