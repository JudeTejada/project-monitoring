import prisma from '@/lib/prisma';
import { DashboardTable } from './DashboardTable';

export default async function DashboardView() {
  const activities = await prisma.activity.findMany();
  return (
    <>
      <main className='contaner mx-auto w-full'>
        <DashboardTable projects={activities} />
      </main>
    </>
  );
}
