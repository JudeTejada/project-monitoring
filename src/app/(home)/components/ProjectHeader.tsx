'use client';

import { Button } from '@/components/ui/button';
import { BarChart, Download, DownloadIcon, LayoutGrid } from 'lucide-react';
import { Project } from '@prisma/client';
import { AddProjectModal } from '@/app/projects/components/AddProjectModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ProjectHeaderProps {
  projects: Project[];
}

export function ProjectHeader({ projects, view, setView }: ProjectHeaderProps & {
  view: 'card' | 'chart';
  setView: (view: 'card' | 'chart') => void;
}) {
  const handleExportCSV = () => {
    const csvData = projects.map(project => {
      const totalParticipants = project.activities.reduce(
        (sum, activity) => sum + activity.numberOfParticipants,
        0
      );

      return {
        'Project Name': project.name,
        'Number of Activities': project._count.activities,
        'Total Participants': totalParticipants
      };
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'projects_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportChart = () => {
    const chartData = projects.map(project => ({
      name: project.name,
      activities: project._count.activities,
      participants: project.activities.reduce(
        (sum, activity) => sum + activity.numberOfParticipants,
        0
      )
    }));

    const csvContent =
      'Project Name,Activities,Total Participants\n' +
      chartData
        .map(row => `${row.name},${row.activities},${row.participants}`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'project_statistics.csv';
    link.click();
  };

  return (
    <div className='flex justify-between r mb-6 mt-10 gap-x-3 flex-col md:flex-row items-start md:items-center gap-y-4' >
      <h3 className='text-2xl font-semibold'>
        FY 2025 Number of Conducted Activities
      </h3>
      <div className='flex items-center gap-x-3'>
        <AddProjectModal onProjectAdded={() => window.location.reload()} />
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='w-full sm:w-auto min-w-[120px]'>
                {view === 'card' ? (
                  <>
                    <LayoutGrid className='h-4 w-4 mr-2' />
                    Card View
                  </>
                ) : (
                  <>
                    <BarChart className='h-4 w-4 mr-2' />
                    Chart View
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px]'>
              <DropdownMenuItem onClick={() => setView('card')} className='py-2'>
                <LayoutGrid className='h-4 w-4 mr-2' />
                Card View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('chart')} className='py-2'>
                <BarChart className='h-4 w-4 mr-2' />
                Chart View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {view === 'chart' && (
            <Button variant='outline' size='sm' onClick={handleExportChart} className='w-full sm:w-auto'>
              <DownloadIcon className='h-4 w-4 mr-2' />
              Export Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}