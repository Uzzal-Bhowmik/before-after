"use client";

import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import {
  useAcceptServiceProviderRequestMutation,
  useDeclineServiceProviderRequestMutation,
} from "@/redux/api/customerApi";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { tagTypes } from "@/redux/tagtypes";
import useRefetchOnMessage from "@/hooks/useRefetchOnMessage";
import CustomStarRating from "@/components/CustomStarRating/CustomStarRating";
import { useState } from "react";
import FormWrapper from "@/components/form-components/FormWrapper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import UTextarea from "@/components/form-components/UTextarea";
import { useCreateReviewMutation } from "@/redux/api/reviewApi";

// Review schema
const reviewSchema = z.object({
  comment: z
    .string({ required_error: "Comment is required" })
    .min(1, "Comment is required"),
});

export default function ShowResDetails({ open, setOpen, data, from }) {
  const [acceptRequest, { isLoading: isAccepting }] =
    useAcceptServiceProviderRequestMutation();
  const [declineRequest, { isLoading: isDeclining }] =
    useDeclineServiceProviderRequestMutation();
  const router = useRouter();
  const { handleInvalidateTags } = useRefetchOnMessage();
  const [rating, setRating] = useState(0);

  // Accept request handler
  const handleAcceptRequest = async () => {
    try {
      await acceptRequest(data?._id).unwrap();

      setOpen(false);
      router.push(`/customer/accept-request?requestId=${data?._id}`);
    } catch (error) {
      console.log("accept error: ", error);
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Reject request handler
  const handleRejectRequest = async () => {
    try {
      await declineRequest(data?._id).unwrap();

      SuccessModal("Request Declined Successfully");
      handleInvalidateTags([tagTypes.servicePosts]);
      setOpen(false);
    } catch (error) {
      console.log("decline error: ", error);
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Submit customer review
  const [addReview, { isLoading: isSubmittingReview }] =
    useCreateReviewMutation();
  const handleSubmitReview = async (formData) => {
    if (!rating) {
      return alert("Please select a rating");
    }

    const payload = {
      rating,
      serviceProvider: data?.user?._id,
      ...formData,
    };

    try {
      await addReview(payload).unwrap();

      setOpen(false);
      SuccessModal("Review Submitted Successfully");
      router.push(`/seller/${data?.user?._id}`);
    } catch (error) {
      setOpen(false);
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <ModalWrapper
      open={open}
      setOpen={setOpen}
      className="2xl:max-w-[50%]"
      title="Response Details"
    >
      <div className="flex-center-between">
        <section className="flex-center-start gap-x-3">
          <CustomAvatar
            img={data?.user?.profile}
            name={data?.user?.name}
            className="h-16 w-16 border border-primary-blue"
          />

          <div>
            <Link
              href={`/seller/${data?.user?._id}`}
              className="block text-left text-xl font-semibold"
            >
              {data?.user?.name}
            </Link>

            <p className="font-dm-sans">{data?.user?.serviceType}</p>
          </div>
        </section>

        {/* Request Status */}
        <Badge
          className="rounded-lg text-base capitalize"
          variant={data?.servicePost?.status}
        >
          {data?.servicePost?.status}
        </Badge>
      </div>

      {/* Post details */}
      <section className="flex-center-start mt-5 gap-x-4 rounded-lg bg-[#c0e6f8] p-3">
        <Image
          src={data?.servicePost?.images[0]?.url}
          alt="Post image"
          height={1200}
          width={1200}
          className="h-[150px] w-32 rounded-lg lg:w-auto"
        />

        <div>
          <h5 className="text-lg font-semibold">{data?.servicePost?.title}</h5>
          <Link
            href={`/services?category=${data?.servicePost?.category?._id}`}
            className="mt-1 block font-medium text-dark-gray hover:underline"
          >
            {data?.servicePost?.category?.name}
          </Link>
        </div>
      </section>

      {/* Service Provider's response */}
      {data?.servicePost?.status !== "completed" && (
        <section className="mt-5 rounded-lg bg-demin-primary-50 p-5">
          <h5 className="border-b-[0.1px] border-b-black/25 text-xl font-semibold">
            Comment from {data?.user?.name || "n/a"}
          </h5>

          <ContentWrapper content={data?.comment} className="py-4 text-lg" />
        </section>
      )}

      {/* Customer's review */}
      {data?.servicePost?.status === "completed" && (
        <section className="mt-5 rounded-lg bg-demin-primary-50 p-5">
          <h5 className="border-b-[0.1px] border-b-black/25 text-xl font-semibold">
            Share your experience working with {data?.user?.name || ""}
          </h5>

          <FormWrapper
            onSubmit={handleSubmitReview}
            resolver={zodResolver(reviewSchema)}
            className="mb-3 mt-4 space-y-5"
          >
            <CustomStarRating
              rating={rating}
              setRating={setRating}
              starSize="30px"
            />

            <UTextarea
              name="comment"
              placeholder="Write your review here... (Reminder: Once submitted reviews will be not editable or deletable!!)"
            />
            <Button
              type="submit"
              variant="primary-blue"
              size="custom"
              loading={isSubmittingReview}
            >
              Submit
            </Button>
          </FormWrapper>
        </section>
      )}

      {/* Action buttons */}
      {from !== "seller" && data?.status === "pending" && (
        <div className="flex-center-between mt-10 gap-x-3">
          <Button
            variant="destructive"
            size="custom"
            className="w-1/4"
            onClick={handleRejectRequest}
            loading={isDeclining}
            disabled={isAccepting || isDeclining}
          >
            Decline
          </Button>

          <Button
            variant="success"
            size="custom"
            className="w-1/4"
            onClick={handleAcceptRequest}
            loading={isAccepting}
            disabled={isAccepting || isDeclining}
          >
            Accept
          </Button>
        </div>
      )}
    </ModalWrapper>
  );
}
