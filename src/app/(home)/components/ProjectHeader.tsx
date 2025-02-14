'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Project } from '@prisma/client';
import { AddProjectModal } from '@/app/projects/components/AddProjectModal';

interface ProjectHeaderProps {
  projects: Project[];
}

export function ProjectHeader({ projects }: ProjectHeaderProps) {
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

  return (
    <div className='flex justify-between items-center mb-6 mt-10'>
      <h3 className='text-2xl font-semibold'>
        FY 2025 Number of Conducted Activities
      </h3>
      <div className='flex items-center gap-x-3'>
        <AddProjectModal onProjectAdded={() => window.location.reload()} />
        <Button onClick={handleExportCSV} variant='outline' size='sm'>
          <Download className='h-4 w-4 mr-2' />
          Export CSV
        </Button>
      </div>
    </div>
  );
}