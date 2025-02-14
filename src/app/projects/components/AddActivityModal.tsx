'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, Project } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  project: z.string().min(1, 'Project is required'),
  year: z.string().min(1, 'Year is required'),
  month: z.string().min(1, 'Month is required'),
  activityName: z.string().min(1, 'Activity name is required'),
  inclusiveDates: z.string().min(1, 'Dates are required'),
  natureOfActivity: z.string().min(1, 'Nature of activity is required'),
  numberOfHours: z.coerce.number().min(1, 'Number of hours is required'),
  initiatedBy: z.string().min(1, 'Initiator is required'),
  status: z.string().min(1, 'Status is required'),
  remarks: z.string().min(1, 'Remarks is required'),
  partneredInstitutions: z
    .string()
    .min(1, 'Partnered institutions is required'),
  beneficiary: z.string().min(1, 'Beneficiary is required'),
  numberOfParticipants: z.coerce
    .number()
    .min(1, 'Number of participants is required'),
  movs: z.string().min(1, 'MOVs is required')
});

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { UploadButton, UploadDropzone } from '@/lib/uploadthing';

// Add isEditing and initialData props
type Props = {
  onActivityAdded: () => void;
  isEditing?: boolean;
  initialData?: Activity;
};
async function fetchProjects() {
  const response = await fetch('/api/projects');
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

export function AddActivityModal({
  onActivityAdded,
  isEditing = false,
  initialData
}: Props) {
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState('');
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const finalProject = showNewProjectInput ? newProject : values.project;
      const response = await fetch(
        isEditing ? `/api/activities/${initialData?.id}` : '/api/activities',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...values,
            project: finalProject
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing ? 'Failed to update activity' : 'Failed to add activity'
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isEditing
          ? 'Activity updated successfully'
          : 'Activity added successfully'
      });
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onActivityAdded();
    },
    onError: () => {
      toast({
        title: isEditing
          ? 'Failed to update activity'
          : 'Failed to add activity',
        variant: 'destructive'
      });
    }
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: '',
      year: '',
      month: '',
      activityName: '',
      inclusiveDates: '',
      natureOfActivity: '',
      numberOfHours: 0,
      initiatedBy: '',
      status: '',
      remarks: '',
      partneredInstitutions: '',
      beneficiary: '',
      numberOfParticipants: 0,
      movs: ''
    }
  });


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  // Initialize form with initial data if editing
  useEffect(() => {
    if (isEditing && initialData) {
      form.reset(initialData);
    }
  }, [form, isEditing, initialData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant='ghost' size='icon'>
            <Pencil className='h-4 w-4' />
          </Button>
        ) : (
          <Button variant='default'>Add new activity</Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Activity' : 'Add New Activity'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='project'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      <Select
                        onValueChange={value => {
                          setShowNewProjectInput(false);
                          field.onChange(value);
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoading ? 'Loading...' : 'Select a project'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project: Project) => (
                            <SelectItem key={project.id} value={project.name}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='activityName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='inclusiveDates'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inclusive Dates</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='natureOfActivity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nature of Activity</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='year'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select year' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='2020'>2020</SelectItem>
                          <SelectItem value='2021'>2021</SelectItem>
                          <SelectItem value='2022'>2022</SelectItem>
                          <SelectItem value='2023'>2023</SelectItem>
                          <SelectItem value='2024'>2024</SelectItem>
                          <SelectItem value='2025'>2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='month'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select month' />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December'
                          ].map(month => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='numberOfHours'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Hours</FormLabel>
                    <FormControl>
                      <Input type='number' min='1' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='numberOfParticipants'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Participants</FormLabel>
                    <FormControl>
                      <Input type='number' min='1' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='initiatedBy'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initiated By</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Ongoing'>Ongoing</SelectItem>
                        <SelectItem value='Completed'>Completed</SelectItem>
                        <SelectItem value='Cancelled'>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='partneredInstitutions'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partnered Institutions</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='beneficiary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beneficiary</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='remarks'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='movs'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MOVs</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className='w-full'
              type='submit'
              disabled={mutation.isPending}
            >
              {isEditing ? 'Update Activity' : 'Add Activity'}
            </Button>
            {/* Existing buttons */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
