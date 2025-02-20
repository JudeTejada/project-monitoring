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

export function ProjectHeader({
  projects,
  view,
  setView
}: ProjectHeaderProps & {
  view: 'card' | 'chart';
  setView: (view: 'card' | 'chart') => void;
}) {
  return (
    <div className='flex justify-between r mb-6 mt-10 gap-x-3 flex-col md:flex-row items-start md:items-center gap-y-4'>
      <h3 className='text-2xl font-semibold'>
        FY 2025 Number of Conducted Activities
      </h3>
      <div className='flex items-center gap-x-3'>
        <AddProjectModal onProjectAdded={() => window.location.reload()} />
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='w-full sm:w-auto min-w-[120px]'
              >
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
              <DropdownMenuItem
                onClick={() => setView('card')}
                className='py-2'
              >
                <LayoutGrid className='h-4 w-4 mr-2' />
                Card View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setView('chart')}
                className='py-2'
              >
                <BarChart className='h-4 w-4 mr-2' />
                Chart View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
