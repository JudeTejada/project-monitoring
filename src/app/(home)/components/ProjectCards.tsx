// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { Project } from '@prisma/client';
import Image from 'next/image';

async function getProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { activities: true }
      }
    }
  });

  return projects;
}

export async function ProjectCards() {
  const projects = await getProjects();

  return (
    <div className='p-4 md:p-0'>
      <h3 className='text-2xl font-semibold mb-6'>
        FY 2025 Number of Conducted Activities
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects.map(project => (
          <Card key={project.id} className='overflow-hidden'>
            <div className='relative w-full h-48'>
              <Image
                src='https://picsum.photos/400/200'
                alt={project.name}
                fill
                className='object-cover'
              />
            </div>
            <CardHeader className='pb-2'>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-semibold text-muted-foreground'>
                {/* @ts-expect-error */}
                {project._count.activities} Activities
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
