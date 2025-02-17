import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '../../components/common/Navbar';
import { ProjectList } from './components/ProjectList';
import { ProjectCardSkeleton } from './components/ProjectCardSkeleton';
import { Suspense } from 'react';

export default async function Home() {
  // const session = await auth.api.getSession({
  //   headers: await headers()
  // });

  // if (!session) {
  //   return redirect('/sign-in');
  // }
  return (

      <ProjectList />
  );
}
