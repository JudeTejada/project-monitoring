'use client';

import { Card } from '@/components/ui/card';

interface StatsCardsProps {
  totalProjects: number;
  totalActivities: number;
  totalParticipants: number;
  averageParticipantsPerActivity?: number;
}

export function StatsCards({
  totalProjects,
  totalActivities,
  totalParticipants,
  averageParticipantsPerActivity = 0
}: StatsCardsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8'>
      <Card className='p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-sm hover:shadow-md'>
        <h3 className='text-lg font-semibold mb-2 text-blue-900'>
          Total Projects
        </h3>
        <p className='text-3xl font-bold text-blue-700'>{totalProjects}</p>
      </Card>
      <Card className='p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-sm hover:shadow-md'>
        <h3 className='text-lg font-semibold mb-2 text-purple-900'>
          Total Activities
        </h3>
        <p className='text-3xl font-bold text-purple-700'>{totalActivities}</p>
      </Card>
      <Card className='p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-sm hover:shadow-md'>
        <h3 className='text-lg font-semibold mb-2 text-emerald-900'>
          Total Participants
        </h3>
        <p className='text-3xl font-bold text-emerald-700'>
          {totalParticipants}
        </p>
      </Card>
    </div>
  );
}
