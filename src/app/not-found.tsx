import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] space-y-4 text-center'>
      <h2 className='text-2xl font-bold'>Page Not Found</h2>
      <p className='text-muted-foreground max-w-md'>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant='outline' asChild>
        <Link href='/'>Return Home</Link>
      </Button>
    </div>
  );
}
