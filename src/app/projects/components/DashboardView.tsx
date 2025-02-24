import prisma from '@/lib/prisma';
import { DashboardTable } from './DashboardTable';

export default async function DashboardView() {
  const activities = await prisma.activity.findMany();
  return (
    <>
      <main className='min-h-screen bg-gray-50'>
        <div className='p-6 h-full'>
          <div className='rounded-lg border bg-card shadow-sm h-full'>
            <DashboardTable projects={activities} />
          </div>
        </div>
      </main>
    </>
  );
}
