import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectCardSkeleton() {
  return (
    <Card className='flex flex-col'>
      <CardHeader className='pb-2 flex flex-row items-center justify-between'>
        <Skeleton className='h-8 w-[200px]' />
        <Skeleton className='h-8 w-8 rounded-full' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-4'>
          <div className='flex-1 space-y-1'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-9 w-12' />
          </div>
          <div className='flex-1 space-y-1'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-9 w-12' />
          </div>
        </div>
        <Skeleton className='w-full h-32 rounded-lg' />
      </CardContent>
    </Card>
  );
}