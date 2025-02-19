import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import AnimatedArrow from "../AnimatedArrow/AnimatedArrow";
import CustomImage from "@/components/CustomImage/CustomImage";
import textTruncate from "@/utils/textTruncate";
import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function ExpertCard({ data }) {
  return (
    <div className="flex h-full flex-col justify-between gap-y-4 rounded-xl border border-gray-200 p-3 px-4 font-dm-sans transition-all duration-300 ease-in-out hover:shadow-md">
      <section>
        <CustomImage
          src={data?.profile}
          alt={"Image of " + data?.name}
          height={1200}
          width={1200}
          className="h-[220px] w-full rounded-lg"
        />

        <h4 className="mt-4 px-1 font-general-sans text-[26px] font-semibold">
          {data?.name}
        </h4>
        <p className="px-1 text-gray-500">{data?.serviceType}</p>

        {/* Location, Rating */}
        <div className="flex-center-between mt-2">
          <Link
            href={
              data?.location?.coordinates?.length > 1
                ? `https://www.google.com/maps/place/${data?.location?.coordinates[1]},${data?.location?.coordinates[0]}`
                : ""
            }
            target="_blank"
            className="flex-center-start gap-x-2 text-gray-500 hover:underline"
          >
            <MapPin size={16} />
            <p>{textTruncate(data?.address, 20)}</p>
          </Link>

          <div className="flex-center-start gap-x-2 text-gray-500">
            <Star size={16} fill="#000000" />
            <p>{data?.avgRating}</p>
          </div>
        </div>

        {/* Price */}
        <p className="my-3 text-2xl font-semibold">
          ${data?.serviceCharge}
          {data?.serviceChargeType === "hourly" ? (
            <span className="text-sm text-dark-gray">/hr</span>
          ) : (
            <span className="text-sm text-dark-gray">/per service</span>
          )}
        </p>

        <p>{textTruncate(data?.aboutMe, 100)}</p>
      </section>

      <section>
        {/* Services */}
        <ScrollArea className="py-1">
          <section className="flex w-max space-x-4">
            {data?.services?.map((service) => (
              <Badge
                className="rounded-full py-1.5 text-black shadow-none"
                variant="secondary"
                key={service?._id}
              >
                {service?.name}
              </Badge>
            ))}
          </section>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>

        <Button variant="primary-blue" className="group mt-3 w-full" asChild>
          <Link href={`/seller/${data?._id}`}>
            View Profile <AnimatedArrow />
          </Link>
        </Button>
      </section>
    </div>
  );
}
