import { ProjectCardSkeleton } from './components/ProjectCardSkeleton';

export default function Loading() {
  return (
    <div className='p-4 md:p-0'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
