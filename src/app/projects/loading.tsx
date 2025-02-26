import { ProjectCardSkeleton } from './components/ProjectCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='p-4 md:p-0'>
      {/* Header skeleton */}
      <div className='flex justify-between items-center mb-6 mt-10'>
        <Skeleton className='h-8 w-[300px]' />
        <div className='flex items-center gap-x-3'>
          <Skeleton className='h-9 w-[120px]' />
          <Skeleton className='h-9 w-[120px]' />
        </div>
      </div>

      {/* Project cards skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
