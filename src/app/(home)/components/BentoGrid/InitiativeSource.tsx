'use client';

import { Bar } from 'react-chartjs-2';
import { Project } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InitiativeSourceProps {
  projects: Project[];
}

export function InitiativeSource({ projects }: InitiativeSourceProps) {
  const [initiatorData, setInitiatorData] = useState<{
    labels: string[];
    counts: number[];
    participation: number[];
  }>({ labels: [], counts: [], participation: [] });

  useEffect(() => {
    const initiatorMap = new Map<string, { count: number; participation: number }>();

    projects.forEach(project => {
      project.activities.forEach(activity => {
        const initiator = activity.initiatedBy || 'Unknown';
        const current = initiatorMap.get(initiator) || { count: 0, participation: 0 };
        initiatorMap.set(initiator, {
          count: current.count + 1,
          participation: current.participation + (activity.numberOfParticipants || 0)
        });
      });
    });

    const sorted = Array.from(initiatorMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8);

    setInitiatorData({
      labels: sorted.map(([label]) => label),
      counts: sorted.map(([, data]) => data.count),
      participation: sorted.map(([, data]) => data.participation)
    });
  }, [projects]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Activity Initiators</h3>
      <Bar
        data={{
          labels: initiatorData.labels,
          datasets: [
            {
              label: 'Activities',
              data: initiatorData.counts,
              backgroundColor: 'rgba(79, 70, 229, 0.7)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 2
            },
            {
              label: 'Participants',
              data: initiatorData.participation,
              backgroundColor: 'rgba(236, 72, 153, 0.7)',
              borderColor: 'rgba(236, 72, 153, 1)',
              borderWidth: 2
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' as const },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${context.parsed.y}`
              }
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }}
      />
    </Card>
  );
}