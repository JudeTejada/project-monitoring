'use client';

import { getStatusColor } from '@/app/activities/components/utils/status-color';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Activity } from '@prisma/client';

interface UpcomingActivitiesProps {
  activities: Activity[];
}

export function UpcomingActivities({ activities }: UpcomingActivitiesProps) {
  const currentDate = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);

  // Helper function to convert month name to index
  const getMonthIndex = (month: string) => {
    const months = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11
    };
    return months[month.toLowerCase() as keyof typeof months] || 0;
  };

  // Get upcoming activities
  const upcomingActivities = activities
    .filter(activity => {
      const activityYear = parseInt(activity.year);
      const activityMonth = getMonthIndex(activity.month);
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const futureYear = threeMonthsFromNow.getFullYear();
      const futureMonth = threeMonthsFromNow.getMonth();

      // Convert dates to comparable numbers (YYYYMM format)
      const activityDate = activityYear * 100 + activityMonth;
      const currentDateNum = currentYear * 100 + currentMonth;
      const futureDateNum = futureYear * 100 + futureMonth;

      return activityDate >= currentDateNum && activityDate <= futureDateNum;
    })
    .sort((a, b) => {
      const yearDiff = parseInt(a.year) - parseInt(b.year);
      if (yearDiff !== 0) return yearDiff;
      return getMonthIndex(a.month) - getMonthIndex(b.month);
    })
    .slice(0, 6);

  return (
    <Card className='p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300'>
      <h3 className='text-lg font-semibold mb-4'>
        Upcoming Activities (Next 3 Months)
      </h3>
      <div className='space-y-3'>
        {upcomingActivities.map((activity, index) => (
          <div
            key={index}
            className='p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex  flex-row items-center justify-between'
          >
            <div className='flex flex-col  justify-between items-start'>
              <p className='font-semibold text-gray-900'>
                {activity.activityName}
              </p>
              <p className='text-sm text-gray-600'>{activity.project}</p>
              <p className='text-sm text-gray-500'>
                {activity.month} {activity.year}
              </p>
            </div>

            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                getStatusColor(activity.status).background,
                getStatusColor(activity.status).color
              )}
            >
              {activity.status}
            </span>
          </div>
        ))}
        {activities.length === 0 && (
          <p className='text-gray-500 text-center py-4'>
            No upcoming activities in the next 3 months
          </p>
        )}
      </div>
    </Card>
  );
}
