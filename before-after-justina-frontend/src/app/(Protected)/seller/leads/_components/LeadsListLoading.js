import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LeadsListLoading({ loading }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Skeleton key={idx} className="h-20 w-full rounded-lg"></Skeleton>
      ))}
    </div>
  );
}
