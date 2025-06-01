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
    },
  };

  return (
    <div className="aspect-square w-full max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
};