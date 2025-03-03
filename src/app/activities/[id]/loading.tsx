import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActivityLoading() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='p-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-6'>
            <Button variant='ghost' className='gap-2' disabled>
              <ArrowLeft className='h-4 w-4' />
              Back to Activities
            </Button>
          </div>

          <Card className='p-6'>
            <div className='space-y-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <Skeleton className='h-8 w-64 mb-2' />
                  <Skeleton className='h-4 w-40' />
                </div>
                <Skeleton className='h-6 w-24 rounded-full' />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  {[...Array(5)].map((_, i) => (
                    <div key={`left-${i}`}>
                      <Skeleton className='h-4 w-24 mb-2' />
                      <Skeleton className='h-5 w-40' />
                    </div>
                  ))}
                </div>

                <div className='space-y-4'>
                  {[...Array(4)].map((_, i) => (
                    <div key={`right-${i}`}>
                      <Skeleton className='h-4 w-24 mb-2' />
                      <Skeleton className='h-5 w-40' />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className='h-4 w-24 mb-2' />
                <Skeleton className='h-20 w-full' />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}