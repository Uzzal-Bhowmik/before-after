"use client";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import TransformationsLoader from "./TransformationsLoader";
import { useGetAllActivitiesQuery } from "@/redux/api/serviceProviderApi";
import Link from "next/link";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";

export default function Transformations() {
  /**
   * GET: Get transformation details from seller activities api
   * Note: These transformation details are posted by service providers
   */
  const { data: allActivitiesRes, isLoading } = useGetAllActivitiesQuery();
  const allActivities = allActivitiesRes?.data || [];

  console.log(allActivities);

  return (
    <section className="my-10">
      <h1 className="primary-title mb-16 text-center">
        Explore Genuine Transformations
      </h1>

      {/* Transformations Carousel */}
      {isLoading ? (
        <TransformationsLoader />
      ) : (
        <>
          {allActivities?.length === 0 ? (
            <EmptyContainer />
          ) : (
            <Carousel
              opts={{
                loop: true,
                duration: 50,
                align: "start",
              }}
              plugins={[
                AutoScroll({
                  speed: 1.5,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                  startDelay: 0,
                }),
              ]}
            >
              <CarouselContent className="p-1">
                {allActivities?.map((data) => (
                  <CarouselItem
                    key={data?._id}
                    className="sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                  >
                    <Link
                      href={`/success-stories/${data?._id}?type=seller`}
                      className="flex-center gap-x-2 rounded-xl"
                      title="See full story"
                    >
                      {/* Before */}
                      <div>
                        <div className="overflow-hidden rounded-xl">
                          <Image
                            src={data?.beforeStory}
                            alt={"Before transformation image"}
                            className="h-[300px] w-[180px] rounded-xl transition-all duration-300 ease-in-out hover:scale-110"
                            width={1200}
                            height={1200}
                          />
                        </div>

                        <h5 className="mt-1 text-center text-lg font-semibold">
                          Before
                        </h5>
                      </div>

                      {/* After */}
                      <div>
                        <h5 className="mb-1 text-center text-lg font-semibold">
                          After
                        </h5>

                        <div className="overflow-hidden rounded-xl">
                          <Image
                            src={data?.afterStory}
                            alt="After transformation image"
                            className="h-[300px] w-[180px] rounded-xl transition-all duration-300 ease-in-out hover:scale-110"
                            width={1200}
                            height={1200}
                          />
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* <div className="mt-14">
          <CarouselDots />
        </div> */}
            </Carousel>
          )}
        </>
      )}
    </section>
  );
}
