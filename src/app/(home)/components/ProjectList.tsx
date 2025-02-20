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

import { DownloadIcon, LayoutGrid } from 'lucide-react';
import { ProjectChart } from './charts/ProjectChart';
import { ParticipantsChart } from './charts/ParticipantsChart';
import { ActivitiesChart } from './charts/ActivitiesChart';

export function ProjectList({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<'card' | 'chart'>('card');

  return (
    <div className='container mx-auto px-4 py-4 sm:py-6 md:px-6 lg:px-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center w-full gap-4 mb-6 sm:mb-8'>
        <ProjectHeader projects={projects} view={view} setView={setView} />
      </div>

      {view === 'card' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8'>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className='space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8'>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='text-lg font-medium mb-4'>Project Distribution</h3>
              <ProjectChart projects={projects} />
            </div>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h3 className='text-lg font-medium mb-4'>Participants per Project</h3>
              <ParticipantsChart projects={projects} />
            </div>
            <div className='bg-white p-4 rounded-lg shadow col-span-2'>
              <h3 className='text-lg font-medium mb-4'>Activities per Project</h3>
              <ActivitiesChart projects={projects} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
