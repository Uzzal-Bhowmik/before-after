import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function SuccessStoryCardSkeleton({ length = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: length }).map((_, idx) => (
        <div key={idx} className="rounded-xl border border-gray-200 p-4">
          <Skeleton className="h-[220px] w-full rounded-lg" />
          <Skeleton className="mt-4 h-4 w-full rounded-lg" />
          <Skeleton className="mt-2 h-4 w-10/12 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-3/4 rounded-lg" />

          <Skeleton className="mt-5 h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
