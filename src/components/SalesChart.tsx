import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { SalesMetrics } from '../types/SalesData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SalesChartProps {
  metrics: SalesMetrics;
  type: 'line' | 'bar' | 'doughnut';
}

export function SalesChart({ metrics, type }: SalesChartProps) {
  if (type === 'bar') {
    const vendedores = Object.keys(metrics.ventasPorVendedor);
    const data = {
      labels: vendedores,
      datasets: [
        {
          label: 'Ventas por Vendedor',
          data: vendedores.map(vendedor => metrics.ventasPorVendedor[vendedor]),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#8B5CF6',
            '#EF4444',
          ],
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: any) {
              return '$' + value.toLocaleString();
            },
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  }

  if (type === 'doughnut') {
    const data = {
      labels: metrics.modelosMasVendidos.map(item => item.modelo),
      datasets: [
        {
          data: metrics.modelosMasVendidos.map(item => item.cantidad),
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#8B5CF6',
            '#EF4444',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
      },
    };

    return <Doughnut data={data} options={options} />;
  }

  return null;
}