import { Project } from '@prisma/client';
import prisma from '@/lib/prisma';
import { BentoGrid } from './components/BentoGrid';

async function getProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { activities: true }
      },
      activities: {
        select: {
          numberOfParticipants: true,
          male: true,
          female: true,
          numberOfHours: true,
          status: true,
          year: true,
          month: true,
          activityName: true,
          inclusiveDates: true,
          project: true
        }
      }
    }
  });

  return projects;
}

export default async function HomeV2() {
  const projects = await getProjects();

  return <BentoGrid projects={projects} />;
}
