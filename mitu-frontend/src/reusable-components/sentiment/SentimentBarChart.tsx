import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface SentimentBarChartProps {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

const SentimentBarChart: React.FC<SentimentBarChartProps> = ({
  positive,
  negative,
  neutral,
  mixed,
}) => {
  const data: ChartData<'bar', number[], string> = {
    labels: ['Pozytywne', 'Negatywne', 'Neutralne', 'Mieszane'],
    datasets: [
      {
        label: 'Liczba komentarzy',
        data: [positive, negative, neutral, mixed],
        backgroundColor: ['green', 'red', 'gray', 'yellow'],
        borderColor: ['darkgreen', 'darkred', 'darkgray', 'darkyellow'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(positive, negative, neutral) + 5,
        title: {
          display: true,
          text: 'Liczba komentarzy',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default SentimentBarChart;
