import { Skeleton } from "@/components/ui/skeleton";

export default function TransformationsLoader() {
  return (
    <section className="mt-10 grid w-full grid-cols-4 gap-x-6 overflow-auto">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="flex-center gap-x-5">
          <Skeleton className="h-[300px] w-[200px] rounded-xl" />

          <Skeleton className="h-[300px] w-[200px] rounded-xl" />
        </div>
      ))}
    </section>
  );
}
