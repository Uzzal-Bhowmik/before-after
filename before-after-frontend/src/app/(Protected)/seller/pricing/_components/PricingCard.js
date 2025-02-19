import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import ContinueToLoginModal from "@/components/ContinueToLoginModal/ContinueToLoginModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCheckoutMutation } from "@/redux/api/paymentApi";
import {
  useCreateSubscriptionMutation,
  useGetMySubscriptionQuery,
} from "@/redux/api/serviceProviderApi";
import { selectUser } from "@/redux/features/authSlice";
import { ErrorModal } from "@/utils/customModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function PricingCard({ data, popularPackageId }) {
  const userId = useSelector(selectUser)?.userId || "";
  const role = useSelector(selectUser)?.role || "";
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // get my subscriptions
  const { data: mySubscription } = useGetMySubscriptionQuery(
    {},
    { skip: !userId || role !== "service_provider" },
  );
  console.log(mySubscription);

  // Create subscription handler
  const [subscribe, { isLoading: isSubscribeLoading }] =
    useCreateSubscriptionMutation();
  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();

  console.log(mySubscription);

  const handleSubscribe = async () => {
    // Check if user is logged in
    if (!userId) {
      return setShowLoginPrompt(true);
    }

    if (mySubscription?._id) {
      return handleCheckout(mySubscription?._id);
    }

    const toastId = toast.loading("Subscribing...");

    try {
      const subscribeRes = await subscribe({ package: data?._id }).unwrap();

      if (subscribeRes?.success) {
        handleCheckout(subscribeRes?.data?._id);

        toast.success("Subscribed! Proceed to payment", { id: toastId });
      }
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Checkout & Continue to payment
  const handleCheckout = async (subscriptionId) => {
    try {
      const checkoutRes = await checkout({
        subscription: subscriptionId,
      }).unwrap();

      if (checkoutRes?.success) {
        window.location.href = checkoutRes?.data;
      }
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Most popular package
  if (data?._id === popularPackageId) {
    return (
      <div className="rounded-3xl border border-gray-300 bg-foundation-accent-800 p-7 text-white 2xl:w-[31%]">
        <div className="space-y-4">
          <div className="flex-center-between">
            <h4 className="text-xl font-semibold">{data?.title}</h4>

            <Badge className="rounded-full bg-gradient-to-br from-[#cbf9f2] to-foundation-accent-400 text-base font-semibold text-black">
              Most Popular
            </Badge>
          </div>

          <h1 className="text-5xl font-semibold">
            ${data?.price}
            <span className="text-lg font-medium text-white/80">
              /{data?.durationDay} days
            </span>
          </h1>

          <p className="font-medium text-white/75">{data?.shortTitle}</p>

          <Button
            variant="primary-blue"
            size="custom"
            className="group w-[200px] rounded-lg bg-gradient-to-br from-[#cbf9f2] to-foundation-accent-400 font-semibold text-black hover:bg-gradient-to-r"
            onClick={handleSubscribe}
            loading={isSubscribeLoading || isCheckoutLoading}
            loaderColor="#ffffff"
            disabled={mySubscription?.isPaid}
          >
            {mySubscription?.package?._id === data?._id &&
            mySubscription?.isPaid ? (
              "Subscribed"
            ) : userId ? (
              <>
                Subscribe <AnimatedArrow />
              </>
            ) : (
              <>
                Get Started <AnimatedArrow />
              </>
            )}
          </Button>

          {/* Show login prompt if not logged in */}
          <ContinueToLoginModal
            open={showLoginPrompt}
            setOpen={setShowLoginPrompt}
          />
        </div>

        <div className="my-4 h-[1px] w-full border-b border-dashed"></div>

        <p className="text-lg">{data?.shortDescription}</p>
      </div>
    );
  }

  return (
    <div className="m-2 rounded-3xl border border-gray-300 p-7 transition-shadow duration-300 ease-in-out hover:shadow-lg 2xl:w-[31%]">
      <div className="space-y-4">
        <h4 className="text-2xl font-semibold">{data?.title}</h4>
        <h1 className="text-5xl font-semibold">
          ${data?.price}
          <span className="text-lg font-medium text-black/50">
            /{data?.durationDay} days
          </span>
        </h1>
        <p className="font-medium text-black/75">{data?.shortTitle}</p>

        <Button
          variant="primary-blue"
          size="custom"
          className="group w-[200px]"
          onClick={handleSubscribe}
          loading={isSubscribeLoading || isCheckoutLoading}
          disabled={mySubscription?.isPaid}
        >
          {mySubscription?.package?._id === data?._id &&
          mySubscription?.isPaid ? (
            "Subscribed"
          ) : userId ? (
            <>
              Subscribe <AnimatedArrow />
            </>
          ) : (
            <>
              Get Started <AnimatedArrow />
            </>
          )}
        </Button>

        <ContinueToLoginModal
          open={showLoginPrompt}
          setOpen={setShowLoginPrompt}
        />
      </div>

      <div className="my-4 h-[1px] w-full border-b border-dashed border-b-black"></div>

      <p className="text-lg">{data?.shortDescription}</p>
    </div>
  );
}
