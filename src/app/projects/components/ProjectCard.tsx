'use client';

/**
 * Dependencies:
 * - Next.js 13+ (App Router)
 * - shadcn/ui (UI Components)
 * - Prisma (Database ORM)
 * - TypeScript
 * - Lucide Icons
 *
 * Required Environment Variables:
 * - DATABASE_URL: PostgreSQL connection string
 */

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
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ProjectCardProps {
  project: Project; // Prisma-generated Project type
}

/**
 * ProjectCard Component
 *
 * Displays a project card with activities and participants statistics.
 * Features:
 * - Image preview modal
 * - Edit functionality
 * - Delete confirmation
 * - Hover animations
 * - Responsive design
 *
 * @param {Project} project - Project data from Prisma
 */
export function ProjectCard({ project }: ProjectCardProps) {
  // State for modal controls
  const [isEditing, setIsEditing] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Calculate total participants across all activities
  const totalParticipants = project.activities.reduce(
    (sum, activity) => sum + activity.numberOfParticipants,
    0
  );

  /**
   * Handles project deletion
   * Makes DELETE request to /api/projects endpoint
   *
   * @param {string} projectId - UUID of the project to delete
   */
  const handleDelete = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete project');

      toast({
        title: 'Project deleted successfully'
      });

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
      {/* Edit Modal Component */}
      <EditProjectModal
        project={project}
        open={isEditing}
        setOpen={setIsEditing}
      />

      {/* Image Preview Modal */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className='sm:max-w-[90vw] sm:max-h-[90vh] p-0'>
          <DialogTitle>Image Preview: {project.name}</DialogTitle>
          <div className='relative w-full h-[80vh]'>
            <Image
              src={project.image ?? 'https://picsum.photos/400/200'}
              alt={project.name}
              fill
              className='object-contain'
              quality={100}
              priority
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Card Component */}
      <Card
        key={project.id}
        className='flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group bg-gradient-to-br from-white to-gray-50/50'
      >
        {/* Card Header with Project Title and Actions */}
        <CardHeader className='pb-6 flex flex-row items-center justify-between border-b border-gray-100'>
          <CardTitle className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
            {project.name}
          </CardTitle>

          {/* Actions Dropdown Menu */}
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hover:bg-gray-100/80'
                >
                  <MoreVertical className='h-4 w-4 text-gray-600' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem asChild>
                  <DropdownMenuItem
                    onSelect={e => {
                      setIsEditing(true);
                      e.preventDefault();
                    }}
                    className='flex items-center gap-2 py-2 cursor-pointer'
                  >
                    <Pencil className='h-4 w-4' /> Edit Project
                  </DropdownMenuItem>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className='text-destructive flex items-center gap-2 py-2 cursor-pointer'
                      onSelect={e => e.preventDefault()}
                    >
                      Delete Project
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription className='text-gray-600'>
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

        {/* Card Content with Statistics and Image */}
        <CardContent className='space-y-6 p-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2 bg-primary/5 p-4 rounded-xl transition-colors group-hover:bg-primary/10 border border-primary/10'>
              <p className='text-sm font-medium text-primary/70 flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-primary/40'></span>
                Activities
              </p>
              <p className='text-4xl font-bold text-primary tracking-tight'>
                {project._count.activities}
              </p>
            </div>
            <div className='space-y-2 bg-primary/5 p-4 rounded-xl transition-colors group-hover:bg-primary/10 border border-primary/10'>
              <p className='text-sm font-medium text-primary/70 flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-primary/40'></span>
                Participants
              </p>
              <p className='text-4xl font-bold text-primary tracking-tight'>
                {totalParticipants}
              </p>
            </div>
          </div>

          {/* Project Image with Preview Functionality */}
          <div
            className='relative w-full h-60 rounded-xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-md cursor-pointer transform group-hover:scale-[1.02]'
            onClick={() => setShowImagePreview(true)}
            role='button'
            aria-label='View full image'
          >
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10'></div>
            <Image
              src={project.image ?? 'https://picsum.photos/400/200'}
              alt={project.name}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              loading='lazy'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              placeholder='blur'
              blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR0XFx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
