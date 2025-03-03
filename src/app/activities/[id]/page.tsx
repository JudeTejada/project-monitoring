import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Users,
  Building2,
  Component,
  Briefcase,
  FileCheck,
  MessageSquare
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatUrl, isValidUrl } from '../components/util';
import prisma from '@/lib/prisma';
import { getStatusColor } from '../components/utils/status-color';

interface ActivityPageProps {
  params: {
    id: string;
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
    include: {
      project_relation: true
    }
  });

  if (!activity) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='p-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-6'>
            <Link href='/activities'>
              <Button variant='ghost' className='gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Back to Activities
              </Button>
            </Link>
          </div>

          <Card className='p-6'>
            <div className='space-y-6'>
              <div className='flex justify-between items-start'>
                <div>
                  <h1 className='text-2xl font-bold mb-2'>
                    {activity.activityName}
                  </h1>
                  <p className='text-muted-foreground'>{activity.project}</p>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
                    getStatusColor(activity.status).background,
                    getStatusColor(activity.status).color
                  )}
                >
                  {activity.status}
                </span>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <Calendar className='h-4 w-4' /> Date
                    </h3>
                    <p>
                      {activity.month} {activity.year}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <Calendar className='h-4 w-4' /> Inclusive Dates
                    </h3>
                    <p>{activity.inclusiveDates}</p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <Briefcase className='h-4 w-4' /> Nature of Activity
                    </h3>
                    <p>{activity.natureOfActivity}</p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <Clock className='h-4 w-4' /> Number of Hours
                    </h3>
                    <p>{activity.numberOfHours}</p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <Users className='h-4 w-4' /> Initiated By
                    </h3>
                    <p>{activity.initiatedBy}</p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <Component className='h-4 w-4' /> Component
                    </h3>
                    <p>{activity.component || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <Building2 className='h-4 w-4' /> Partnered Institutions
                    </h3>
                    <p>{activity.partneredInstitutions}</p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <Users className='h-4 w-4' /> Participants
                    </h3>
                    <p>Total: {activity.numberOfParticipants}</p>
                    <p className='text-sm text-gray-500'>
                      Male: {activity.male} | Female: {activity.female}
                    </p>
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-500 flex items-center gap-2'>
                      <FileCheck className='h-4 w-4' /> MOVs
                    </h3>
                    {isValidUrl(activity.movs) ? (
                      <a
                        href={activity.movs}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 hover:underline'
                      >
                        {formatUrl(activity.movs)}
                      </a>
                    ) : (
                      <p>{activity.movs}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className='font-medium text-gray-500 mb-2 flex items-center gap-2'>
                  <MessageSquare className='h-4 w-4' /> Remarks
                </h3>
                <p className='whitespace-pre-wrap'>{activity.remarks}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
