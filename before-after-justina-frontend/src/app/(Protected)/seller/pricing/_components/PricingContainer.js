"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllPackagesQuery } from "@/redux/api/pricingApi";
import PricingCard from "./PricingCard";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";

export default function PricingContainer() {
  // Get packages
  const { data: packagesRes, isLoading: isPackageLoading } =
    useGetAllPackagesQuery();
  const packages = packagesRes?.data || [];

  // Get most popular package
  const { data: popularPackagesRes, isLoading: isPopularPackagesLoading } =
    useGetAllPackagesQuery({ sort: "-popularity" });
  const popularPackageId = popularPackagesRes?.data[0]?._id || "";

  return (
    <>
      <section className="space-y-1 text-center">
        <p className="text-lg font-medium text-primary-blue">Pricing</p>
        <h1 className="text-5xl font-semibold">
          We&apos;ve got the perfect plan for your business
        </h1>
      </section>

      {isPackageLoading || isPopularPackagesLoading ? (
        <div className="mt-12 flex w-full flex-wrap items-stretch justify-center">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="m-4 w-[30%] space-y-4 rounded-xl border p-4"
            >
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-3 w-full rounded-xl" />
              <Skeleton className="h-3 w-3/4 rounded-xl" />
              <Skeleton className="h-3 w-10/12 rounded-xl" />
              <Skeleton className="h-3 w-1/2 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <section className="mt-12 flex w-full flex-wrap items-stretch justify-center gap-3">
          {packages?.map((data, idx) => (
            <PricingCard
              key={idx}
              data={data}
              popularPackageId={popularPackageId}
            />
          ))}
        </section>
      )}
    </>
  );
}
