import { Skeleton } from "./Skeleton";

export default function FullPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-gray-100 dark:bg-gray-900 p-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-64 w-full max-w-4xl rounded" />
    </div>
  );
}
