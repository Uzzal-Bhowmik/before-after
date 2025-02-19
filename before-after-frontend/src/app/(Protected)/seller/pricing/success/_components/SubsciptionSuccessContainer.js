"use client";

import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import ConfettiLottie from "@/components/ConfettiLottie/ConfettiLottie";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import SuccessLottie from "@/components/SuccessLottie/SuccessLottie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSubscriptionByIdQuery } from "@/redux/api/serviceProviderApi";
import { selectUser } from "@/redux/features/authSlice";
import { ErrorModal } from "@/utils/customModal";
import { format } from "date-fns";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function SubscriptionSuccessContainer() {
  const router = useRouter();
  const subscriptionId = useSearchParams().get("subscriptionId");
  const userId = useSelector(selectUser)?.userId;

  // Get subscription details
  // useEffect(() => {
  //   if(subscriptionId) {

  //   }
  // }, [subscriptionId])
  const { data: subscription, isLoading: isSubscriptionLoading } =
    useGetSubscriptionByIdQuery(subscriptionId, {
      skip: !userId || !subscriptionId,
    });

  console.log(subscription);

  if (isSubscriptionLoading) {
    return (
      <div className="flex-center h-[65vh]">
        <CustomLoader color="var(--primary-blue)" size={36} />
      </div>
    );
  }

  if (!userId) {
    ErrorModal("Unauthorized access");
    router.push("/");
    return;
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

          <div className="mt-6 font-dm-sans text-lg">
            <p>
              You&apos;ve successfully subscribed to our{" "}
              <span className="font-bold">
                {subscription?.package?.title} for $
                {subscription?.package?.price}
              </span>
            </p>

            <p>
              Your subscription is active till{" "}
              <Badge variant="approved" className="rounded-full text-sm">
                {subscription?.ExpiredAt &&
                  format(subscription?.ExpiredAt, "dd MMM yyyy, h:mm a")}
              </Badge>
            </p>
          </div>

          <div className="mx-auto mt-8 flex w-max items-center gap-x-5 p-1">
            <Button
              size="custom"
              variant="secondary"
              className="border border-primary-blue"
              asChild
            >
              <Link href="/seller/dashboard">See Dashboard</Link>
            </Button>

            <Button
              className="group"
              variant="primary-blue"
              size="custom"
              asChild
            >
              <Link href={"/seller/leads"}>
                See Leads <AnimatedArrow />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
