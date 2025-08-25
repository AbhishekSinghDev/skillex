import { Skeleton } from "@/components/ui/skeleton";

const NoteContentSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-6">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>

    {/* Attachment Skeleton */}
    <div className="space-y-3">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-80 w-full" />
    </div>
  </div>
);

export default NoteContentSkeleton;
