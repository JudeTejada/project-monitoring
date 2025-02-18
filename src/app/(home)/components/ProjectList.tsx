'use client';
import prisma from '@/lib/prisma';
import { Project } from '@prisma/client';
import Image from 'next/image';
import { ProjectHeader } from './ProjectHeader';

import { toast } from '@/hooks/use-toast';
import { ProjectCard } from './ProjectCard';

import { BarChart as TremorBarChart, DonutChart } from '@tremor/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { BarChart, DownloadIcon, LayoutGrid } from 'lucide-react';
import { ProjectChart } from './ProjectChart';

export function ProjectList({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<'card' | 'chart'>('card');



  const handleExportChart = () => {
    // Convert chart data to CSV
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
    <div className='p-4 md:p-0'>
      <div className='flex justify-between items-center mb-6 '>
        <ProjectHeader projects={projects} />
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
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
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setView('card')}>
                <LayoutGrid className='h-4 w-4 mr-2' />
                Card View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('chart')}>
                <BarChart className='h-4 w-4 mr-2' />
                Chart View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {view === 'chart' && (
            <Button variant='outline' size='sm' onClick={handleExportChart}>
              <DownloadIcon className='h-4 w-4 mr-2' />
              Export Data
            </Button>
          )}
        </div>
      </div>

      {view === 'card' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className='space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='text-lg font-medium mb-4'>Project Distribution</h3>
              <ProjectChart projects={projects} />

            </div>
            <div className='bg-white p-4 rounded-lg shadow'>
              {/* <h3 className='text-lg font-medium mb-4'>
                Project Activities Overview
              </h3>
              <DonutChart
                data={chartData}
                category='activities'
                index='name'
                // valueFormatter={value => `${value} activities`}
                className='h-80'
                colors={['#16468F', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']}
                showAnimation
              /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
