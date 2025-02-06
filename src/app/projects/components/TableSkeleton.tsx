export default function TableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="h-12 bg-gray-200 rounded-t-lg mb-4" />

      {/* Rows skeleton */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex flex-col space-y-3 mb-4">
          <div className="h-10 bg-gray-200 rounded-md" />
        </div>
      ))}
    </div>
  );
}