import prisma from '@/lib/prisma';
import { DashboardTable } from './DashboardTable';

export default async function DashboardView() {
  const activities = await prisma.activity.findMany();
  return (
    <>
      <div className='rounded-lg border bg-card shadow-sm h-full'>
        <DashboardTable projects={activities} />
      </div>
    </>
  );
}
