import { ProjectList } from './components/ProjectList';
import prisma from '@/lib/prisma';
import { Project } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
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
export default async function Home() {
  // const session = await auth.api.getSession({
  //   headers: await headers()
  // });

  // if (!session) {
  //   return redirect('/sign-in');
  // }
  const projects = await getProjects();

  return <ProjectList projects={projects} />;
}
