import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";

export default function ServicesSkeleton({ length = 4, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length }).map((_, idx) => (
        <div key={idx} className="">
          <Skeleton className="h-[220px] w-full rounded-lg" />
          <Skeleton className="mt-2.5 h-4 w-3/4 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
