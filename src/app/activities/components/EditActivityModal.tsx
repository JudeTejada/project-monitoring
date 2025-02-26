'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Activity } from '@prisma/client';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type Props = {
  activity: Activity;
  onActivityUpdated: () => void;
  trigger?: React.ReactNode;
};

export function EditActivityModal({
  activity,
  onActivityUpdated,
  trigger
}: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: activity.year,
    month: activity.month,
    project: activity.project,
    inclusiveDates: activity.inclusiveDates,
    activityName: activity.activityName,
    natureOfActivity: activity.natureOfActivity,
    numberOfHours: activity.numberOfHours.toString(),
    initiatedBy: activity.initiatedBy,
    status: activity.status,
    remarks: activity.remarks,
    partneredInstitutions: activity.partneredInstitutions,
    numberOfParticipants: activity.numberOfParticipants.toString(),
    male: activity.male.toString(),
    female: activity.female.toString(),
    component: activity.component,
    movs: activity.movs
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/activities/${activity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update activity');
      }

      toast({
        title: 'Activity updated successfully'
      });

      onActivityUpdated();
      setOpen(false);
    } catch (error) {
      console.error('Error updating activity:', error);
      toast({
        title: 'Failed to update activity',
        description: 'An error occurred while updating the activity.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' size='sm'>
            Edit Activity
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
          <DialogDescription>
            Update the activity details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='year'>Year</Label>
              <Input
                id='year'
                value={formData.year}
                onChange={e => handleChange('year', e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='month'>Month</Label>
              <Input
                id='month'
                value={formData.month}
                onChange={e => handleChange('month', e.target.value)}
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='project'>Project</Label>
            <Input
              id='project'
              value={formData.project}
              onChange={e => handleChange('project', e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='component'>Component</Label>
            <Input
              id='component'
              value={formData.component}
              onChange={e => handleChange('component', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='inclusiveDates'>Inclusive Dates</Label>
            <Input
              id='inclusiveDates'
              value={formData.inclusiveDates}
              onChange={e => handleChange('inclusiveDates', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='activityName'>Activity Name</Label>
            <Input
              id='activityName'
              value={formData.activityName}
              onChange={e => handleChange('activityName', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='natureOfActivity'>Nature of Activity</Label>
            <Input
              id='natureOfActivity'
              value={formData.natureOfActivity}
              onChange={e => handleChange('natureOfActivity', e.target.value)}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='numberOfHours'>Number of Hours</Label>
              <Input
                id='numberOfHours'
                type='number'
                value={formData.numberOfHours}
                onChange={e => handleChange('numberOfHours', e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='numberOfParticipants'>Number of Participants</Label>
              <Input
                id='numberOfParticipants'
                type='number'
                value={formData.numberOfParticipants}
                onChange={e =>
                  handleChange('numberOfParticipants', e.target.value)
                }
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='male'>Male Participants</Label>
              <Input
                id='male'
                type='number'
                value={formData.male}
                onChange={e => handleChange('male', e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='female'>Female Participants</Label>
              <Input
                id='female'
                type='number'
                value={formData.female}
                onChange={e => handleChange('female', e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='initiatedBy'>Initiated By</Label>
            <Input
              id='initiatedBy'
              value={formData.initiatedBy}
              onChange={e => handleChange('initiatedBy', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='status'>Status</Label>
            <Select
              value={formData.status}
              onValueChange={value => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='PENDING'>Pending</SelectItem>
                <SelectItem value='Ongoing'>Ongoing</SelectItem>
                <SelectItem value='Completed'>Completed</SelectItem>
                <SelectItem value='Cancelled'>Cancelled</SelectItem>
                <SelectItem value='Postponed'>Postponed</SelectItem>
                <SelectItem value='Rescheduled'>Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='remarks'>Remarks</Label>
            <Input
              id='remarks'
              value={formData.remarks}
              onChange={e => handleChange('remarks', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='partneredInstitutions'>Partnered Institutions</Label>
            <Input
              id='partneredInstitutions'
              value={formData.partneredInstitutions}
              onChange={e =>
                handleChange('partneredInstitutions', e.target.value)
              }
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='movs'>MOVs</Label>
            <Input
              id='movs'
              value={formData.movs}
              onChange={e => handleChange('movs', e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}