import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ExpertCardSkeleton({ length = 4, className }) {
  return (
    <div>
      <div
        className={cn(
          "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
          className,
        )}
      >
        {Array.from({ length }).map((_, idx) => (
          <div key={idx} className="rounded-xl border p-3">
            <Skeleton className="h-[220px] w-full rounded-lg" />
            <Skeleton className="mt-2.5 h-4 w-3/4 rounded-lg" />
            <Skeleton className="mt-2.5 h-4 w-3/4 rounded-lg" />
            <Skeleton className="mt-2.5 h-4 w-1/2 rounded-lg" />
            <Skeleton className="mt-2.5 h-4 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
