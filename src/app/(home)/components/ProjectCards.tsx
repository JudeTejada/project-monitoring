import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { Project } from '@prisma/client';
import Image from 'next/image';
import { ProjectHeader } from './ProjectHeader';

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

export async function ProjectCards() {
  const projects = await getProjects();

  return (
    <div className='p-4 md:p-0'>
      <ProjectHeader projects={projects} />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects.map(project => {
          const totalParticipants = project.activities.reduce(
            (sum, activity) => sum + activity.numberOfParticipants,
            0
          );

          return (
            <Card key={project.id} className='flex flex-col'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-2xl'>{project.name}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex gap-4'>
                  <div className='flex-1 space-y-1'>
                    <p className='text-base text-muted-foreground'>Activities</p>
                    <p className='text-3xl font-bold'>
                      {project._count.activities}
                    </p>
                  </div>
                  <div className='flex-1 space-y-1'>
                    <p className='text-base text-muted-foreground'>Participants</p>
                    <p className='text-3xl font-bold'>{totalParticipants}</p>
                  </div>
                </div>
                <div className='relative w-full h-32 rounded-lg overflow-hidden'>
                  <Image
                    src='https://picsum.photos/400/200'
                    alt={project.name}
                    fill
                    className='object-cover'
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
