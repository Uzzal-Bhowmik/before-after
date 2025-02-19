"use client";

import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import ConfettiLottie from "@/components/ConfettiLottie/ConfettiLottie";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import SuccessLottie from "@/components/SuccessLottie/SuccessLottie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSingleRequestQuery } from "@/redux/api/customerApi";
import { ErrorModal } from "@/utils/customModal";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function RequestAcceptContainer() {
  const router = useRouter();
  const requestId = useSearchParams().get("requestId");

  /**
   * GET: Get request details by id
   */
  const { data: requestDetails, isLoading } = useGetSingleRequestQuery(
    requestId,
    {
      skip: !requestId,
    },
  );

  if (isLoading) {
    return (
      <div className="flex-center h-[80vh]">
        <CustomLoader />
      </div>
    );
  }

  if (!requestId || requestDetails?.status !== "approved") {
    router.push("/customer/view-responses");

    return ErrorModal("Invalid Request ID");
  }

  return (
    <div className="z-10">
      <SuccessLottie />

      <div className="absolute inset-0 -z-10 h-full w-full">
        <ConfettiLottie />
      </div>

      <div className="flex-center mt-10 text-center">
        <motion.div
          initial={{
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 1.3,
            type: "spring",
            stiffness: 250,
            damping: 30,
            mass: 0.2,
          }}
          className="max-h-fit overflow-hidden"
        >
          <h2 className="text-5xl font-bold text-primary-blue">
            Congratulations!
          </h2>

          <p className="mb-10 mt-6 text-lg">
            You&apos;ve accepted{" "}
            <span className="font-semibold">{requestDetails?.user?.name}</span>
            &apos;s request for the job:{" "}
            <span className="font-semibold">
              {requestDetails?.servicePost?.title}.
            </span>{" "}
            <br /> Hope both of you have an amazing experience working together.
          </p>

          <div className="mx-auto flex w-max items-center gap-x-5 p-1">
            <Button
              size="custom"
              variant="secondary"
              className="group border border-primary-blue"
              asChild
            >
              <Link href="/customer/place-request">
                See other posts <AnimatedArrow />
              </Link>
            </Button>

            <Button
              className="group"
              variant="primary-blue"
              size="custom"
              asChild
            >
              <Link href={`/messages?user=${requestDetails?.user?._id}`}>
                Contact {requestDetails?.user?.name || ""} <AnimatedArrow />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
