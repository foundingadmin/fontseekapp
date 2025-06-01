import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { UserScores } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  scores: UserScores;
}

const traitDescriptions = {
  Tone: 'Formal vs. Casual (your brand voice)',
  Energy: 'Calm vs. Energetic (brand intensity)',
  Design: 'Minimal vs. Expressive (visual styling)',
  Era: 'Classic vs. Modern (timelessness)',
  Structure: 'Organic vs. Geometric (typographic shape language)',
};

export const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const data = {
    labels: ['Tone', 'Energy', 'Design', 'Era', 'Structure'],
    datasets: [
      {
        data: [scores.tone, scores.energy, scores.design, scores.era, scores.structure],
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(52, 211, 153)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(52, 211, 153)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
        ticks: {
          display: false,
          stepSize: 1,
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const description = traitDescriptions[label as keyof typeof traitDescriptions];
            return [`Score: ${value}`, description];
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Your Brand's Font Personality Profile</h2>
        <p className="text-white/60">
          Based on your answers, this chart shows how your brand expresses itself across five strategic traits.
        </p>
      </div>

      <div className="aspect-square w-full max-w-md mx-auto">
        <Radar data={data} options={options} />
      </div>

      <div className="text-center">
        <p className="text-sm text-white/60">
          Higher scores indicate your brand leans more toward that trait in its font personality.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-white/60 max-w-2xl mx-auto">
        {Object.entries(traitDescriptions).map(([trait, description]) => (
          <div key={trait} className="bg-white/5 rounded-lg p-3">
            <span className="font-medium text-white/80">{trait}:</span>
            <br />
            {description}
          </div>
        ))}
      </div>
    </div>
  );
};