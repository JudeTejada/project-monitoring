import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardView from './components/DashboardView';
import { Navbar } from '../../components/common/Navbar';
import { Suspense } from 'react';
import TableSkeleton from './components/TableSkeleton';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/');
  }

  return (
    <div className='mt-10 text-center container mx-auto w-full'>
      <Navbar />

      <Suspense fallback={<TableSkeleton />}>
        <DashboardView />
      </Suspense>
    </div>
  );
}
