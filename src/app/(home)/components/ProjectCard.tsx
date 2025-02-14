'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditProjectModal } from './EditProjectModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import React, { useState } from 'react';
import { Project } from '@prisma/client';
import { toast } from '@/hooks/use-toast';

export function ProjectCard({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);
  const totalParticipants = project.activities.reduce(
    (sum, activity) => sum + activity.numberOfParticipants,
    0
  );

  const handleDelete = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      toast({
        title: 'Project deleted successfully'
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Failed to delete project',
        description: 'An error occurred while deleting the project.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <EditProjectModal
        project={project}
        open={isEditing}
        setOpen={setIsEditing}
      />

      <Card key={project.id} className='flex flex-col'>
        <CardHeader className='pb-2 flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl'>{project.name}</CardTitle>
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <MoreVertical className='h-4 w-4 text-gray-800' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                  <DropdownMenuItem
                    onSelect={e => {
                      setIsEditing(true);
                      e.preventDefault();
                    }}
                  >
                    <Pencil className='h-4 w-4' /> Edit
                  </DropdownMenuItem>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className='text-destructive'
                      onSelect={e => e.preventDefault()}
                    >
                      Delete Project
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this project? This
                        action will also delete all associated activities and
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(project.id)}
                        className='bg-destructive hover:bg-destructive/90'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-4'>
            <div className='flex-1 space-y-1'>
              <p className='text-base text-muted-foreground'>Activities</p>
              <p className='text-3xl font-bold'>{project._count.activities}</p>
            </div>
            <div className='flex-1 space-y-1'>
              <p className='text-base text-muted-foreground'>Participants</p>
              <p className='text-3xl font-bold'>{totalParticipants}</p>
            </div>
          </div>
          <div className='relative w-full h-32 rounded-lg overflow-hidden'>
            <Image
              src={project.image ?? 'https://picsum.photos/400/200'}
              alt={project.name}
              fill
              className='object-cover'
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
