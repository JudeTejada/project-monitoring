import prisma from '@/lib/prisma';
import { DashboardTable } from './DashboardTable';

export default async function DashboardView() {
  const activities = await prisma.activity.findMany();
  return (
    <>
      <main className='container mx-auto p-6'>
        <div className='rounded-lg border bg-card shadow-sm'>
          <DashboardTable projects={activities} />
        </div>
      </main>
    </>
  );
}
