"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ExpertCard from "@/components/ExpertCard/ExpertCard";
import { useGetAllServiceProvidersQuery } from "@/redux/api/serviceProviderApi";

export default function Experts() {
  const { data: expertsRes, isLoading } = useGetAllServiceProvidersQuery();
  const experts = expertsRes?.data || [];

  return (
    <ResponsiveContainer classes={"mt-40"}>
      <h1 className="primary-title mb-5 text-center">
        Experts You Can Count On
      </h1>

      {/* View all button */}
      <Link href="/experts">
        <button className="flex-center group mb-2 ml-auto w-max gap-x-2 text-sm font-medium text-gray-600 transition-all hover:text-primary-blue">
          View All{" "}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-in-out group-hover:translate-x-1"
          />
        </button>
      </Link>

      {/* Experts */}
      <section>
        <Carousel
          opts={{
            loop: false,
            duration: 50,
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 4200,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
        >
          <CarouselContent className="-ml-5 px-1 py-2">
            {experts?.map((expert) => (
              <CarouselItem
                key={expert?._id}
                className="pl-5 sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
              >
                <ExpertCard data={expert} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-14">
            <CarouselDots />
          </div>
        </Carousel>
      </section>
    </ResponsiveContainer>
  );
}
