'use client';

import { Project } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

interface BentoGridProps {
  projects: Project[];
}

export function BentoGrid({ projects }: BentoGridProps) {
  const totalProjects = projects.length;
  const totalActivities = projects.reduce(
    (sum, project) => sum + (project._count?.activities || 0),
    0
  );
  const totalParticipants = projects.reduce(
    (sum, project) =>
      sum +
      project.activities.reduce(
        (actSum, activity) => actSum + (activity.numberOfParticipants || 0),
        0
      ),
    0
  );

  const projectNames = projects.map(project => project.name);
  const activitiesData = projects.map(
    project => project._count?.activities || 0
  );
  const participantsData = projects.map(project =>
    project.activities.reduce(
      (sum, activity) => sum + (activity.numberOfParticipants || 0),
      0
    )
  );

  const genderDataByProject = projects.map(project => {
    const projectGender = project.activities.reduce(
      (acc, activity) => {
        acc.male += activity.male || 0;
        acc.female += activity.female || 0;
        return acc;
      },
      { male: 0, female: 0 }
    );
    return {
      projectName: project.name,
      ...projectGender
    };
  });

  // Get current date and calculate date 3 months from now
  const currentDate = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);

  // Get all activities and sort them by date
  const allActivities = projects.flatMap(project =>
    project.activities.map(activity => ({
      ...activity,
      projectName: project.name
    }))
  );

  // Get upcoming activities
  const upcomingActivities = allActivities
    .filter(activity => {
      const [startDate] = activity.inclusiveDates.split('-');
      const activityDate = new Date(startDate.trim());
      return activityDate >= currentDate && activityDate <= threeMonthsFromNow;
    })
    .sort((a, b) => {
      const dateA = new Date(a.inclusiveDates.split('-')[0].trim());
      const dateB = new Date(b.inclusiveDates.split('-')[0].trim());
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  // Calculate monthly activity distribution
  const monthlyDistribution = allActivities.reduce((acc, activity) => {
    const month = activity.month;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <Card className='p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors'>
          <h3 className='text-lg font-semibold mb-2 text-blue-900'>
            Total Projects
          </h3>
          <p className='text-3xl font-bold text-blue-700'>{totalProjects}</p>
        </Card>
        <Card className='p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-colors'>
          <h3 className='text-lg font-semibold mb-2 text-purple-900'>
            Total Activities
          </h3>
          <p className='text-3xl font-bold text-purple-700'>
            {totalActivities}
          </p>
        </Card>
        <Card className='p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-colors'>
          <h3 className='text-lg font-semibold mb-2 text-emerald-900'>
            Total Participants
          </h3>
          <p className='text-3xl font-bold text-emerald-700'>
            {totalParticipants}
          </p>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Upcoming Activities (Next 3 Months)
          </h3>
          <div className='space-y-3'>
            {upcomingActivities.map((activity, index) => (
              <div
                key={index}
                className='p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100'
              >
                <p className='font-semibold text-gray-900'>
                  {activity.activityName}
                </p>
                <p className='text-sm text-gray-600'>{activity.projectName}</p>
                <p className='text-sm text-gray-500'>
                  {activity.inclusiveDates}
                </p>
              </div>
            ))}
            {upcomingActivities.length === 0 && (
              <p className='text-gray-500 text-center py-4'>
                No upcoming activities in the next 3 months
              </p>
            )}
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Monthly Activity Distribution
          </h3>
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
        </Card>
      </div>

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
                  (genderDataByProject.reduce((sum, p) => sum + p.female, 0) ||
                    1)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
