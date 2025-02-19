import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("skeleton animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
