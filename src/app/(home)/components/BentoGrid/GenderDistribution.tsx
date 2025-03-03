'use client';

import { Card } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';

interface GenderData {
  projectName: string;
  male: number;
  female: number;
}

interface GenderDistributionProps {
  genderDataByProject: GenderData[];
  totalActivities: number;
  totalProjects: number;
  totalParticipants: number;
}

export function GenderDistribution({
  genderDataByProject,
  totalActivities,
  totalProjects,
  totalParticipants
}: GenderDistributionProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <Card className='p-6 md:col-span-2'>
        <h3 className='text-lg font-semibold mb-4'>Gender Distribution</h3>
        <Bar
          data={{
            labels: genderDataByProject.map(project => project.projectName),
            datasets: [
              {
                label: 'Male',
                data: genderDataByProject.map(project => project.male),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2
              },
              {
                label: 'Female',
                data: genderDataByProject.map(project => project.female),
                backgroundColor: 'rgba(236, 72, 153, 0.7)',
                borderColor: 'rgba(236, 72, 153, 1)',
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
            }
          }}
        />
      </Card>

      <Card className='p-6 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors'>
        <h3 className='text-lg font-semibold mb-4 text-gray-900'>
          Quick Stats
        </h3>
        <div className='space-y-4'>
          <div className='p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
            <p className='text-sm text-gray-500'>
              Average Activities per Project
            </p>
            <p className='text-xl font-semibold text-blue-700'>
              {(totalActivities / totalProjects).toFixed(1)}
            </p>
          </div>
          <div className='p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
            <p className='text-sm text-gray-500'>
              Average Participants per Activity
            </p>
            <p className='text-xl font-semibold text-purple-700'>
              {(totalParticipants / totalActivities).toFixed(1)}
            </p>
          </div>
          <div className='p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
            <p className='text-sm text-gray-500'>Gender Ratio (M:F)</p>
            <p className='text-xl font-semibold text-emerald-700'>
              {(
                genderDataByProject.reduce((sum, p) => sum + p.male, 0) /
                (genderDataByProject.reduce((sum, p) => sum + p.female, 0) || 1)
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}