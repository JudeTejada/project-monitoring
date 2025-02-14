import prisma from '@/lib/prisma';
import { Project } from '@prisma/client';
import Image from 'next/image';
import { ProjectHeader } from './ProjectHeader';

import { toast } from '@/hooks/use-toast';
import { ProjectCard } from './ProjectCard';

async function getProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { activities: true }
      },
      activities: {
        select: {
          numberOfParticipants: true
        }
      }
    }
  });

  return projects;
}

export async function ProjectList() {
  const projects = await getProjects();

  return (
    <div className='p-4 md:p-0'>
      <ProjectHeader projects={projects} />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
