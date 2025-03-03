'use client';

import { Card } from '@/components/ui/card';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ActivityDistributionProps {
  chartType: 'bar' | 'line' | 'pie';
  setChartType: (value: 'bar' | 'line' | 'pie') => void;
  months: string[];
  monthlyDistribution: Record<string, number>;
}

export function ActivityDistribution({
  chartType,
  setChartType,
  months,
  monthlyDistribution
}: ActivityDistributionProps) {
  return (
    <Card className='p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>
          Monthly Activity Distribution
        </h3>
        <Select
          value={chartType}
          onValueChange={(value: 'bar' | 'line' | 'pie') =>
            setChartType(value)
          }
        >
          <SelectTrigger className='w-[120px]'>
            <SelectValue placeholder='Chart type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='bar'>Bar Chart</SelectItem>
            <SelectItem value='line'>Line Chart</SelectItem>
            <SelectItem value='pie'>Pie Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {chartType === 'bar' && (
        <Bar
          data={{
            labels: months,
            datasets: [
              {
                label: 'Activities',
                data: months.map(month => monthlyDistribution[month] || 0),
                backgroundColor: 'rgba(79, 70, 229, 0.6)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }}
        />
      )}
      {chartType === 'line' && (
        <Line
          data={{
            labels: months,
            datasets: [
              {
                label: 'Activities',
                data: months.map(month => monthlyDistribution[month] || 0),
                borderColor: 'rgba(79, 70, 229, 1)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' as const },
              tooltip: {
                callbacks: {
                  label: context => `Activities: ${context.parsed.y}`
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
              }
            }
          }}
        />
      )}
      {chartType === 'pie' && (
        <Pie
          data={{
            labels: months,
            datasets: [
              {
                data: months.map(month => monthlyDistribution[month] || 0),
                backgroundColor: [
                  'rgba(79, 70, 229, 0.6)',
                  'rgba(147, 51, 234, 0.6)',
                  'rgba(236, 72, 153, 0.6)',
                  'rgba(59, 130, 246, 0.6)',
                  'rgba(16, 185, 129, 0.6)',
                  'rgba(245, 158, 11, 0.6)',
                  'rgba(239, 68, 68, 0.6)',
                  'rgba(99, 102, 241, 0.6)',
                  'rgba(217, 70, 239, 0.6)',
                  'rgba(20, 184, 166, 0.6)',
                  'rgba(234, 88, 12, 0.6)',
                  'rgba(168, 85, 247, 0.6)'
                ]
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'right' as const },
              tooltip: {
                callbacks: {
                  label: context => `Activities: ${context.parsed}`
                }
              }
            }
          }}
        />
      )}
    </Card>
  );
}