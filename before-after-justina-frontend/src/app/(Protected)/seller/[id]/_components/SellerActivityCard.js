import textTruncate from "@/utils/textTruncate";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";

export default function SellerActivityCard({ data }) {
  return (
    <div className="flex flex-col justify-between rounded-lg bg-light-primary-blue p-4 transition-all duration-300 ease-in-out hover:shadow-md">
      <div className="mb-6 space-y-3">
        <div className="flex-stretch-center">
          <div className="relative aspect-square w-1/2">
            <Image
              src={data?.beforeStory}
              alt="Before transformation"
              height={1200}
              width={1200}
              className="h-[250px] w-full rounded-l-lg"
            />
            <span className="absolute bottom-2 left-2 rounded bg-black bg-opacity-80 px-2 py-1 text-white">
              Before
            </span>
          </div>

          {/* White divider */}
          <div className="h-auto w-1 bg-white" />

          <div className="relative aspect-square w-1/2">
            <Image
              src={data?.afterStory}
              alt="After transformation"
              height={1200}
              width={1200}
              className="h-[250px] w-full rounded-r-lg"
            />
            <span className="absolute bottom-2 left-2 rounded bg-black bg-opacity-80 px-2 py-1 text-white">
              After
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Story Summary</h3>
          <p className="font-dm-sans text-lg font-medium text-gray-500">
            {textTruncate(data?.title, 150)}
          </p>
        </div>
      </div>

      <Button variant="primary-blue" className="group mt-2 w-full" asChild>
        <Link href={`/success-stories/${data?._id}?type=seller`}>
          Read Full Story <AnimatedArrow />
        </Link>
      </Button>
    </div>
  );
}
