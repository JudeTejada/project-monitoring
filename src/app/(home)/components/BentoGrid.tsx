'use client';

import { Project } from '@prisma/client';
import { Card } from '@/components/ui/card';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement
} from 'chart.js';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import { UpcomingActivities } from './BentoGrid/UpcomingActivities';
import { StatsCards } from './BentoGrid/StatsCards';
import { ActivityDistribution } from './BentoGrid/ActivityDistribution';
import { PartnershipNetwork } from './BentoGrid/PartnershipNetwork';
import { InitiativeSource } from './BentoGrid/InitiativeSource';
import { ReportExporter } from './BentoGrid/ReportExporter';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement
);

interface BentoGridProps {
  projects: Project[];
}

export function BentoGrid({ projects }: BentoGridProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({ from: null, to: null });
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  const filteredProjects =
    selectedProject === 'all'
      ? projects
      : projects.filter(p => p.name === selectedProject);

  const filteredActivities = filteredProjects.flatMap(project =>
    project.activities
      .filter(activity => {
        if (!dateRange.from || !dateRange.to) return true;
        const [startDate] = activity.inclusiveDates.split('-');
        const activityDate = new Date(startDate.trim());
        return activityDate >= dateRange.from && activityDate <= dateRange.to;
      })
      .map(activity => ({
        ...activity,
        projectName: project.name
      }))
  );

  const totalProjects = filteredProjects.length;
  const totalActivities = filteredProjects.reduce(
    (sum, project) => sum + (project._count?.activities || 0),
    0
  );
  const totalParticipants = filteredActivities.reduce(
    (sum, activity) => sum + (activity.numberOfParticipants || 0),
    0
  );

  const genderDataByProject = filteredProjects.map(project => {
    const projectGender = project.activities
      .filter(activity => {
        if (!dateRange.from || !dateRange.to) return true;
        const [startDate] = activity.inclusiveDates.split('-');
        const activityDate = new Date(startDate.trim());
        return activityDate >= dateRange.from && activityDate <= dateRange.to;
      })
      .reduce(
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

  // Calculate monthly activity distribution
  const monthlyDistribution = filteredActivities.reduce((acc, activity) => {
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
    <div className=' p-4 py-10' id='bento-grid'>
      <div className='flex flex-wrap gap-4 mb-6 items-center justify-between'>
        <div className='flex gap-4 items-center'>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Select project' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-[280px] justify-start text-left font-normal'
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={range =>
                  setDateRange({
                    from: range?.from || null,
                    to: range?.to || null
                  })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <ReportExporter
          projects={filteredProjects}
          filteredActivities={filteredActivities}
          totalParticipants={totalParticipants}
          genderDataByProject={genderDataByProject}
        />
      </div>
      <StatsCards
        totalActivities={totalActivities}
        totalParticipants={totalParticipants}
        totalProjects={totalProjects}
      />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <UpcomingActivities activities={filteredActivities} />
        <div className='grid grid-cols-1 gap-6'>
          <ActivityDistribution
            chartType={chartType}
            setChartType={setChartType}
            months={months}
            monthlyDistribution={monthlyDistribution}
          />

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
                    (genderDataByProject.reduce(
                      (sum, p) => sum + p.female,
                      0
                    ) || 1)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card className='p-6 '>
          <h3 className='text-lg font-semibold mb-4'>Gender Distribution</h3>
          {chartType === 'bar' && (
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

        <InitiativeSource projects={filteredProjects} />
      </div>
    </div>
  );
}
