import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

export function BentoGridLoading() {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-wrap gap-4 mb-6 items-center justify-between'>
        <div className='flex gap-4 items-center'>
          <div className='w-[200px] h-10 bg-gray-200 animate-pulse rounded-md' />
          <Button
            variant='outline'
            className='w-[280px] justify-start text-left font-normal'
            disabled
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            <span className='w-32 bg-gray-200 animate-pulse rounded' />
          </Button>
        </div>
        <Button variant='outline' disabled>
          <div className='w-32 bg-gray-200 animate-pulse rounded' />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8'>
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className='p-6 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-sm hover:shadow-md'
          >
            <div className='h-6 w-32 bg-gray-200 animate-pulse rounded mb-4' />
            <div className='h-8 w-16 bg-gray-300 animate-pulse rounded' />
          </Card>
        ))}
      </div>

      {/* Activities and Distribution */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Upcoming Activities */}
        <Card className='p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300'>
          <div className='h-6 w-48 bg-gray-200 animate-pulse rounded mb-6' />
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100'
              >
                <div className='h-5 w-3/4 bg-gray-200 animate-pulse rounded mb-2' />
                <div className='h-4 w-1/2 bg-gray-100 animate-pulse rounded mb-2' />
                <div className='h-4 w-1/3 bg-gray-100 animate-pulse rounded' />
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Distribution and Quick Stats */}
        <div className='grid grid-cols-1 gap-6'>
          <Card className='p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='flex justify-between items-center mb-4'>
              <div className='h-6 w-48 bg-gray-200 animate-pulse rounded' />
              <div className='w-[120px] h-10 bg-gray-200 animate-pulse rounded-md' />
            </div>
            <div className='h-[300px] bg-gray-100 animate-pulse rounded-lg' />
          </Card>

          <Card className='p-6 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors'>
            <div className='h-6 w-32 bg-gray-200 animate-pulse rounded mb-6' />
            <div className='space-y-4'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
                >
                  <div className='h-4 w-40 bg-gray-200 animate-pulse rounded mb-2' />
                  <div className='h-6 w-16 bg-gray-300 animate-pulse rounded' />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Gender Distribution and Initiative Source */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card className='p-6'>
          <div className='h-6 w-40 bg-gray-200 animate-pulse rounded mb-6' />
          <div className='h-[300px] bg-gray-100 animate-pulse rounded-lg' />
        </Card>

        <Card className='p-6 bg-gradient-to-br from-gray-50 to-gray-100'>
          <div className='h-6 w-32 bg-gray-200 animate-pulse rounded mb-6' />
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='h-4 w-40 bg-gray-200 animate-pulse rounded mb-2' />
                <div className='h-6 w-16 bg-gray-300 animate-pulse rounded' />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
