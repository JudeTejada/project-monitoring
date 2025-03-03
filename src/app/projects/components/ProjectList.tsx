'use client';
import { Project } from '@prisma/client';
import { ProjectHeader } from './ProjectHeader';

import { toast } from '@/hooks/use-toast';
import { ProjectCard } from './ProjectCard';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

import { DownloadIcon, LayoutGrid } from 'lucide-react';
import { ExportableCharts } from './charts/ExportableCharts';
import html2canvas from 'html2canvas';

export function ProjectList({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<'card' | 'chart'>('card');

  const handleExportCards = useCallback(async () => {
    const cardsContainer = document.getElementById('project-cards-container');
    if (!cardsContainer) return;

    try {
      const canvas = await html2canvas(cardsContainer, {
        scale: 2, // Increase quality
        backgroundColor: '#ffffff'
      });

      // Convert to blob
      canvas.toBlob(blob => {
        if (!blob) return;

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'project-cards.png';
        link.href = url;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);
      }, 'image/png');

      toast({
        title: 'Project cards exported successfully'
      });
    } catch (error) {
      console.error('Error exporting cards:', error);
      toast({
        title: 'Failed to export project cards',
        description: 'An error occurred while exporting the cards.',
        variant: 'destructive'
      });
    }
  }, []);

  return (
    <div className=' px-4 py-4 sm:py-6 md:px-6 lg:px-8'>
      <div className='flex flex-col sm:flex-row justify-between items-center w-full gap-4 mb-6 sm:mb-8'>
        <ProjectHeader projects={projects} view={view} setView={setView} />
      </div>

      {view === 'card' ? (
        <div className='space-y-4'>
          <Button
            variant='outline'
            onClick={handleExportCards}
            className='mb-4'
          >
            <DownloadIcon className='h-4 w-4 mr-2' />
            Export Cards as PNG
          </Button>
          <div
            id='project-cards-container'
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8'
          >
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <div className='space-y-8'>
          <ExportableCharts projects={projects} />
        </div>
      )}
    </div>
  );
}
