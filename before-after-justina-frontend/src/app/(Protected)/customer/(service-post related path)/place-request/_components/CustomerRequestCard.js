import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import CustomCarousel from "@/components/CustomCarousel/CustomCarousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCompleteServicePostMutation,
  useDeleteServicePostMutation,
  useGetRequestsForPostQuery,
} from "@/redux/api/customerApi";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";
import textTruncate from "@/utils/textTruncate";
import { formatDistanceToNow } from "date-fns";
import { ChartNoAxesColumn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function CustomerRequestCard({ post }) {
  console.log(post);

  // GET: Get service provider requests for this post
  const { data: serviceProviderRequestsRes, isLoading } =
    useGetRequestsForPostQuery(
      { servicePost: post?._id },
      { skip: !post?._id },
    );

  // PATCH: Mark service post as done
  const [markPostAsDone, { isLoading: isMarkAsDoneLoading }] =
    useCompleteServicePostMutation();
  const handleMarkPostAsDone = async () => {
    try {
      await markPostAsDone(post?._id).unwrap();

      SuccessModal(
        "Request Completed Successfully!",
        "Please share your review with us",
      );
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  // Delete service post
  const [deleteServicePost, { isLoading: isDeleting }] =
    useDeleteServicePostMutation();
  const handleDeletePost = async () => {
    ConfirmModal(
      "Remove Post from List?",
      "This service post will be removed from your list",
    ).then(async (res) => {
      if (res?.isConfirmed) {
        try {
          await deleteServicePost(post?._id).unwrap();
          SuccessModal("Post removed successfully!");
        } catch (error) {
          ErrorModal(error?.data?.message || error?.message);
        }
      }
    });
  };

  return (
    <div>
      <p className="mb-2 px-1 text-sm text-dark-gray">
        {formatDistanceToNow(post?.createdAt, { addSuffix: true })}
      </p>

      {isLoading ? (
        <div className="flex gap-x-5 rounded-xl bg-demin-primary-50 p-4">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      ) : (
        <div className="flex flex-col justify-between gap-y-4 rounded-xl bg-demin-primary-50 p-3">
          <div className="flex-center-start relative gap-x-4">
            {/* Post image */}
            <CustomCarousel
              dots
              className="relative w-1/2 rounded-lg bg-primary-blue/5 p-1"
            >
              {post?.images?.map((image) => (
                <CarouselItem key={image?._id}>
                  <Image
                    src={image?.url}
                    alt={post?.title}
                    height={1200}
                    width={1200}
                    className="mx-auto h-[130px] w-auto rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CustomCarousel>

            <Badge
              variant={post?.status?.toLowerCase()}
              className="absolute -right-6 -top-5 rounded-full font-medium capitalize shadow-none"
            >
              {post?.status}
            </Badge>

            <div className="w-1/2">
              <h5 className="text-xl font-semibold">
                {textTruncate(post?.title, 35)}
              </h5>
              <p className="mb-4 mt-0.5 font-medium text-black/50">
                {post?.category?.name}
              </p>

              {post?.status === "pending" && (
                <div className="flex-center-start gap-x-1">
                  <ChartNoAxesColumn size={20} strokeWidth={4} />

                  <p className="font-medium">
                    {serviceProviderRequestsRes?.data?.length} responses
                  </p>
                </div>
              )}
            </div>
          </div>

          {/**
           * Buttons Logic
           * 1. If post status is pending, show view post and view responses buttons
           * 2. If status is ongoing, show contact seller and view post button
           *    Note: If customer accepts a seller request, then service post status converts to ongoing,
           *          else if he declines, service post status still remains pending
           */}
          {post?.status === "pending" ? (
            <div className="flex-center-between gap-x-3">
              <Button variant="primary-blue" className="w-full text-xs" asChild>
                <Link href={`/customer/view-request/${post?._id}`}>
                  View Post
                </Link>
              </Button>

              <Button variant="primary-blue" className="w-full text-xs" asChild>
                <Link href={`/customer/view-responses?postId=${post?._id}`}>
                  View Responses
                </Link>
              </Button>
            </div>
          ) : post?.status === "ongoing" ? (
            <div className="flex-center-between gap-x-3">
              <Button
                variant="primary-blue"
                className="w-full text-xs"
                onClick={handleMarkPostAsDone}
                loading={isMarkAsDoneLoading}
              >
                Mark as done
              </Button>

              <Button variant="primary-blue" className="w-full text-xs" asChild>
                <Link href={`/messages?user=${post?.approvedRequest?.user}`}>
                  Contact Seller
                </Link>
              </Button>
            </div>
          ) : (
            post?.status === "completed" && (
              <div className="flex-center-between gap-x-3">
                <Button
                  variant="primary-blue"
                  className="w-full text-xs"
                  onClick={handleDeletePost}
                  loading={isDeleting}
                >
                  Remove
                </Button>

                <Button
                  variant="primary-blue"
                  className="group w-full text-xs"
                  asChild
                >
                  <Link href="/customer/view-responses">
                    Share Your Review <AnimatedArrow />
                  </Link>
                </Button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
