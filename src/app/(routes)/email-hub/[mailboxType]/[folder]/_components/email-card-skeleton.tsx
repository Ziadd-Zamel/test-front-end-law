function EmailCardSkeleton() {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="px-6 py-4 flex items-start gap-4">
        {/* Avatar Skeleton */}
        <div className="size-10 rounded-full bg-gray-200 animate-pulse" />

        <div className="flex-1 space-y-3">
          {/* Top Row - Name and Date */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-5 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Subject Line */}
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />

          {/* Body Preview */}
          <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function EmailListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <EmailCardSkeleton key={index} />
      ))}
    </>
  );
}
