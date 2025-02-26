import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header section skeleton */}
      <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b gap-4'>
        <Skeleton className="h-8 w-64" /> {/* Title */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto'>
          <div className='flex gap-4'>
            {/* Project filter skeleton */}
            <Skeleton className="h-10 w-[180px]" />
            {/* Time filter skeleton */}
            <Skeleton className="h-10 w-[180px]" />
          </div>

          {/* Action buttons skeleton */}
          <div className='flex gap-4 w-full sm:w-auto'>
            <Skeleton className="h-10 w-[120px]" /> {/* Export CSV */}
            <Skeleton className="h-10 w-[120px]" /> {/* Add Activity */}
            <Skeleton className="h-10 w-[120px]" /> {/* Import */}
          </div>
        </div>
      </header>

      {/* Table skeleton */}
      <div className="rounded-md border overflow-x-auto mt-4">
        <div className="min-w-[1200px]">
          {/* Table header skeleton */}
          <div className="bg-gray-100 p-4">
            <div className="grid grid-cols-15 gap-4">
              {[...Array(15)].map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          </div>

          {/* Table rows skeleton */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border-t p-4">
              <div className="grid grid-cols-15 gap-4">
                {[...Array(15)].map((_, cellIndex) => (
                  <Skeleton key={cellIndex} className="h-6" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}