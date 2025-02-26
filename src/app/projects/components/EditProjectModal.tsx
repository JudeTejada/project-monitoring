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
import { toast } from '@/hooks/use-toast';
import { Project } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useUploadThing } from '@/lib/uploadthing';

type Props = {
  project: Project;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EditProjectModal({ project, children, open, setOpen }: Props) {
  const [name, setName] = useState(project.name);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(project.image || null);
  const [isLoading, setIsLoading] = useState(false);
  const { startUpload, isUploading } = useUploadThing('imageUploader');
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.gif']
    },
    maxFiles: 1,
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setPreview(URL.createObjectURL(acceptedFiles[0]));
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = project.image;

      if (file) {
        const uploadResult = await startUpload([file]);
        if (uploadResult && uploadResult[0]) {
          imageUrl = uploadResult[0].url;
        }
      }

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          image: imageUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      toast({
        title: 'Project updated successfully'
      });

      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Failed to update project',
        description: 'An error occurred while updating the project.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label htmlFor='name'>Project Name</label>
              <Input
                id='name'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Enter project name'
                required
              />
            </div>

            <div className='space-y-2'>
              <label>Project Image</label>
              <div
                {...getRootProps()}
                className='border-dashed border-2 rounded-lg p-6 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer'
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className='relative w-full h-48'>
                    <Image
                      src={preview}
                      alt={name}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='text-center'>
                    <p>Drag & drop an image here or click to select</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
