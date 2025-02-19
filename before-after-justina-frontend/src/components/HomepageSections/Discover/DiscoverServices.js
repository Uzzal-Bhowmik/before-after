"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import React from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useGetAllSubcategoriesQuery } from "@/redux/api/categoryApi";
import { ArrowRight } from "lucide-react";
import ServicesSkeleton from "./_components/ServicesSkeleton";
import ServiceCard from "@/components/shared/ServiceCard/ServiceCard";

export default function DiscoverServices() {
  /**
   * GET: Get all subcategories
   * Note: Subcategories are defined as services. And each category may have multiple subcategories
   */
  const { data: subCategoriesRes, isLoading } = useGetAllSubcategoriesQuery();
  const subCategories = subCategoriesRes?.data || [];

  return (
    <ResponsiveContainer classes="mt-28">
      <h1 className="primary-title text-center">Explore Services</h1>

      {/* View all button */}
      <Link href="/services">
        <button className="flex-center group mb-3 ml-auto mt-5 w-max gap-x-2 text-sm font-medium text-gray-600 transition-all hover:text-primary-blue lg:text-base">
          View All{" "}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-in-out group-hover:translate-x-1"
          />
        </button>
      </Link>

      {/* ----------- Services ---------------- */}
      {isLoading ? (
        <ServicesSkeleton />
      ) : (
        <Carousel
          opts={{
            loop: false,
            duration: 50,
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="relative"
        >
          <CarouselContent>
            {subCategories.map((service) => (
              <CarouselItem
                key={service?._id}
                className="group overflow-hidden sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ServiceCard service={service} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 lg:-bottom-16">
            <CarouselPrevious
              className="h-10 w-10 bg-primary-blue text-white"
              icon={<ChevronLeft className="!h-6 !w-6" />}
            />

            <CarouselNext
              className="left-0 h-10 w-10 bg-primary-blue text-white"
              icon={<ChevronRight className="!h-6 !w-6" />}
            />
          </div>
        </Carousel>
      )}
    </ResponsiveContainer>
  );
}
