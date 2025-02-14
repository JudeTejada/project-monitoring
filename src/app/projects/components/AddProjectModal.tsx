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
// import { useUploadThing } from '@/lib/uploadthing';
import { Cloud, File, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { useDropzone } from '@uploadthing/react';

type Props = {
  onProjectAdded: () => void;
};
export function AddProjectModal({ onProjectAdded }: Props) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing('imageUploader');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = '';

      if (file) {
        const uploadResult = await startUpload([file]);
        if (uploadResult && uploadResult[0]) {
          imageUrl = uploadResult[0].url;
        }
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          image: imageUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      toast({
        title: 'Project created successfully'
      });

      setName('');
      setFile(null);
      setPreview(null);
      setOpen(false);
      onProjectAdded();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Failed to create project',
        description: 'An error occurred while creating the project.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const elm = useDropzone({
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

  console.log(elm);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Add Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Create a new project to organize your activities.
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
                {...elm.getRootProps()}
                // type='image'
                className='border-dashed border-2 rounded-lg p-6 border-gray-300 hover:border-gray-400 transition-colors'
              >
                {preview ? (
                  <div className='relative w-full h-48'>
                    <Image
                      src={preview}
                      alt='Preview'
                      className='object-contain'
                      fill
                    />
                  </div>
                ) : (
                  <div
                    className='flex flex-col items-center justify-center text-xs text-gray-600'
                    {...elm.getInputProps()}
                  >
                    <Cloud className='h-6 w-6 mb-2' />
                    <div className='text-center'>
                      <p>Drag & drop your image here or click to select</p>
                      <p className='mt-2'>Max file size: 4MB</p>
                    </div>
                  </div>
                )}
              </div>
              {file && (
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <File className='h-4 w-4' />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type='submit' disabled={isLoading || isUploading}>
              {isLoading || isUploading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
