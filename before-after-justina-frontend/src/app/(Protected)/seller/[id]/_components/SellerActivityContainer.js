import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetAllActivitiesQuery } from "@/redux/api/serviceProviderApi";
import Autoplay from "embla-carousel-autoplay";
import SellerActivityCard from "./SellerActivityCard";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

export default function SellerActivityContainer({ sellerId }) {
  /**
   * GET: Get seller activities
   */
  const { data: sellerActivitiesRes, isLoading: isActivitiesLoading } =
    useGetAllActivitiesQuery(sellerId, { skip: !sellerId });
  const sellerActivities = sellerActivitiesRes?.data || [];

  return (
    <div>
      {sellerActivities?.length === 0 ? (
        <EmptyContainer message="No activity found" />
      ) : (
        <>
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
              {sellerActivities.map((activity) => (
                <CarouselItem
                  key={activity?._id}
                  className="group basis-1/2 overflow-hidden md:basis-1/3 lg:basis-1/4"
                >
                  <SellerActivityCard data={activity} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="absolute -top-[520px] right-0 -translate-x-1/2 lg:-bottom-16">
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
        </>
      )}
    </div>
  );
}
