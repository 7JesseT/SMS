import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GOLD_COLOR = '#D4AF37';
const ACCENT_GOLD = '#CDA434';
const DARK_GOLD = '#A67C00';

/**
 * Chart Widget component
 */
const ChartWidget = ({ type = 'line', title = '', data = {}, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          font: { size: 12 },
          color: '#666666',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
      },
    },
    ...options,
  };

  const chartProps = {
    data: {
      labels: data.labels || [],
      datasets: data.datasets
        ? data.datasets.map((dataset) => ({
            ...dataset,
            borderColor: dataset.borderColor || GOLD_COLOR,
            backgroundColor: dataset.backgroundColor || GOLD_COLOR + '30',
            fill: true,
            tension: 0.4,
          }))
        : [],
    },
    options: defaultOptions,
  };

  const ChartComponent = {
    line: Line,
    bar: Bar,
    doughnut: Doughnut,
  }[type] || Line;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-beige-200">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ChartComponent {...chartProps} height={300} />
    </div>
  );
};

export default React.memo(ChartWidget);
