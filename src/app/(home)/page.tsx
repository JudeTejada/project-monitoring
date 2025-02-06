import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '../../components/common/Navbar';
import { ProjectCards } from './components/ProjectCards';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return redirect('/sign-in');
  }
  return (
    <div className='mt-10 container mx-auto w-full'>
      <Navbar />
      <ProjectCards />
    </div>
  );
}
