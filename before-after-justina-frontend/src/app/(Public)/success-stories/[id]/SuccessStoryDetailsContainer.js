"use client";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Preview from "@/components/Preview/Preview";
import CommentSection from "@/components/shared/CommentSection/CommentSection";
import { Button } from "@/components/ui/button";
import ImagePreviewer from "@/components/ui/image-previewer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteTransformationPostMutation,
  useEditTransformationPostMutation,
  useGetTransformationPostByIdQuery,
} from "@/redux/api/customerApi";
import {
  useDeleteActivityPostMutation,
  useGetActivityByIdQuery,
} from "@/redux/api/serviceProviderApi";
import { selectUser } from "@/redux/features/authSlice";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";
import { DotDivider } from "@/utils/dividers";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Trash2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { CalendarPlus2 } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Edit2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

/**
 * Note: This page is used to show both
 * 1. Transformation/Success Story - posted by customer
 * 2. Seller activity post - posted by seller
 */

export default function SuccessStoryDetailsContainer({ id }) {
  const [data, setData] = useState({});
  const userId = useSelector(selectUser)?.userId;
  const router = useRouter();

  /**
   * Detect story type
   * Note: Seller activity and customer transformation post, both will be shown in this page.
   *       So, if the story type is `seller`, then the seller activity will be shown.
   */
  const storyType = useSearchParams().get("type");

  // GET: Seller activity data
  const { data: sellerActivity, isFetching: isSellerActivityLoading } =
    useGetActivityByIdQuery(id, {
      skip: !id || storyType !== "seller",
    });

  // GET: Customer transformation story
  const { data: transformationPost, isFetching: isTransformationPostLoading } =
    useGetTransformationPostByIdQuery(id, {
      skip: !id || storyType === "seller",
    });

  // Set data based in user type
  useEffect(() => {
    if (sellerActivity) {
      return setData(sellerActivity);
    }

    if (transformationPost) {
      return setData(transformationPost);
    }
  }, [sellerActivity, transformationPost]);

  // Image previewer
  const [previewImgIndex, setPreviewImgIndex] = useState(-1); // hide previewer if index -1

  /**
   * DELETE: Delete transformation post handler - for customers
   */
  const [deleteTransformationPost] = useDeleteTransformationPostMutation();
  const handleDeleteTransformationPost = () => {
    ConfirmModal("Delete Post?", "This post will be permanently deleted").then(
      async (res) => {
        if (res.isConfirmed) {
          try {
            await deleteTransformationPost(id).unwrap();

            SuccessModal("Post Deleted Successfully");

            router.push("/customer/place-request");
          } catch (error) {
            ErrorModal(error?.data?.message || error?.message);
          }
        }
      },
    );
  };

  /**
   * DELETE: Delete transformation post handler - for seller
   */
  const [deleteActivityPost] = useDeleteActivityPostMutation();
  const handleDeleteActivityPost = () => {
    ConfirmModal("Delete Post?", "This post will be permanently deleted").then(
      async (res) => {
        if (res.isConfirmed) {
          try {
            await deleteActivityPost(id).unwrap();

            SuccessModal("Post Deleted Successfully");

            router.push("/seller/dashboard");
          } catch (error) {
            ErrorModal(error?.data?.message || error?.message);
          }
        }
      },
    );
  };

  if (isTransformationPostLoading || isSellerActivityLoading) {
    return <SuccessStoryContainerLoader />;
  }

  return (
    <div>
      {/* Before and after image container */}
      <div className="flex-center mb-16 mt-8 gap-x-4">
        <div className="relative text-center">
          <Preview onClick={() => setPreviewImgIndex(0)}>
            <Image
              src={data?.beforeStory}
              alt="Before transformation image"
              height={1200}
              width={1200}
              className="h-auto max-h-[500px] w-[320px] rounded-lg object-cover"
            />
          </Preview>

          <p className="absolute bottom-3 left-3 mb-2 rounded bg-black/80 px-4 py-1 font-medium text-white">
            Before
          </p>
        </div>

        {/* Arrow right */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          id="Capa_1"
          width="60"
          height="60"
          fill="#000"
          version="1.1"
          viewBox="0 0 367.339 367.34"
          className="rotate-12"
        >
          <path d="M337.591.932c-13.464 6.12-26.315 12.852-39.168 20.196-11.628 6.12-25.704 12.24-35.496 21.42-5.508 4.896 0 15.3 7.344 12.852 0 0 .612 0 .612-.612 1.836 1.224 3.061 2.448 4.896 4.284 0 .612.611 1.836.611 2.448.612 1.224 1.836 2.448 3.061 3.672-17.748 33.048-34.272 66.096-55.08 96.696-6.12 9.18-12.853 17.748-20.808 25.704-19.584-31.212-51.409-67.32-89.965-60.588-50.796 9.18-23.256 63.647 3.06 82.008 31.212 22.644 58.14 21.42 85.068 0 12.24 20.808 20.809 44.063 19.584 66.708-1.836 54.468-50.796 63.647-91.8 49.571 6.12-15.912 7.956-34.271 4.284-50.184-6.12-28.764-50.184-54.468-75.888-34.272-25.092 20.196 22.032 71.604 37.332 82.009 4.284 3.06 9.18 6.119 14.076 8.567-.612.612-.612 1.225-1.224 1.836-28.152 44.064-65.484 6.12-82.62-25.092-2.448-4.896-9.18-.612-7.344 4.284 14.076 32.436 42.84 70.38 81.396 48.348 9.18-5.508 17.136-13.464 22.644-23.256 33.66 13.464 72.829 13.464 97.308-17.136 29.376-36.72 11.017-84.456-8.567-119.952l1.224-1.224c34.884-33.66 56.304-81.396 78.336-124.236 4.284 3.06 9.181 6.12 13.464 9.18 3.061 1.836 7.345 1.224 9.792-1.224 17.748-20.808 31.212-45.9 35.496-73.44 1.836-6.731-4.895-11.627-11.628-8.567m-159.12 206.855c-23.256 13.464-46.512-3.06-63.648-18.972-22.644-20.808-16.524-54.468 18.36-47.735 17.748 3.672 31.824 19.584 43.452 32.436 6.12 6.732 12.241 14.687 17.749 23.255-4.896 4.285-10.405 7.957-15.913 11.016m-62.424 111.384s-.612 0 0 0c-16.524-8.567-28.764-20.808-38.556-36.107-4.284-6.732-7.956-14.076-9.792-22.032-6.12-20.808 26.928-10.404 35.496-6.12 23.256 12.852 21.42 42.228 12.852 64.259M306.379 67.028c-.612 0-.612-.612-1.224-.612 0-1.836-1.225-3.672-3.672-4.896-4.284-1.836-8.568-4.284-12.853-6.732-1.836-1.224-5.508-4.896-5.508-3.672 0-.612-.612-1.224-1.224-1.224 6.731-3.672 13.464-8.568 20.195-12.24 8.568-4.896 17.748-9.792 26.929-14.688-4.282 15.3-12.238 30.6-22.643 44.064"></path>
        </svg>

        <div className="relative text-center">
          <Preview onClick={() => setPreviewImgIndex(1)}>
            <Image
              src={data?.afterStory}
              alt="After transformation image"
              height={1200}
              width={1200}
              className="h-auto max-h-[500px] w-[320px] rounded-lg object-cover"
            />
          </Preview>

          <p className="absolute bottom-3 left-3 mb-2 rounded bg-black/80 px-4 py-1 font-medium text-white">
            After
          </p>
        </div>

        {/* --------------------- */}
        <ImagePreviewer
          imageUrls={[data?.beforeStory, data?.afterStory]}
          previewImgIndex={previewImgIndex}
          setPreviewImgIndex={setPreviewImgIndex}
        />
      </div>

      {/* Description */}
      <section>
        <div className="flex items-baseline gap-x-5">
          <h2 className="text-2xl font-semibold md:text-3xl xl:text-4xl">
            {data?.summary || data?.title}
          </h2>

          {/* Show edit/delete button if author is same as logged in user */}
          {(data?.author?._id === userId || data?.author === userId) && (
            <div>
              <Link
                href={
                  storyType === "seller"
                    ? `/seller/update-activity/${data?._id}`
                    : `/customer/update-transformation/${data?._id}`
                }
                className="inline-flex rounded-full p-1.5 hover:bg-primary-blue hover:text-white"
              >
                <Edit2 size={22} />
                <span className="sr-only">Edit story</span>
              </Link>

              <button
                className="rounded-full p-1.5 hover:bg-danger hover:text-white"
                onClick={
                  storyType === "seller"
                    ? handleDeleteActivityPost
                    : handleDeleteTransformationPost
                }
              >
                <Trash2 size={22} />
                <span className="sr-only">Delete story</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex-center-start mb-10 mt-3 gap-x-5">
          <div className="flex-center-start gap-x-3 font-dm-sans font-medium text-gray-500">
            <h3>{data?.category?.name}</h3>
            <span>
              <ChevronRight size={15} />
            </span>
            <h3>{data?.subcategory?.name}</h3>
          </div>

          <DotDivider className="bg-gray-500" />

          <p className="font-medium text-gray-500">
            Posted by{" "}
            <span className="italic">
              {data?.author?.name || "anonymous"} on{" "}
              {data?.createdAt && format(data?.createdAt, "MMM d, yyyy")}
            </span>
          </p>
        </div>

        <div>
          <ContentWrapper content={data?.description} />
        </div>
      </section>

      {/* Navigation */}
      <div className="flex-center-between my-20 font-dm-sans text-lg">
        <Link
          href="/customer/place-request"
          className="flex-center-start gap-x-2 text-primary-blue hover:text-primary-blue/75"
        >
          <ArrowLeft size={18} /> See all your stories
        </Link>

        <Link
          href={`/seller/${data?.serviceProvider || data?.author?._id}`}
          className="flex-center gap-x-2 text-primary-blue hover:text-primary-blue/75"
        >
          <CalendarPlus2 size={16} /> Book appointment with the seller!
        </Link>

        <Link
          href="/success-stories"
          className="flex-center-start gap-x-2 text-primary-blue hover:text-primary-blue/75"
        >
          Explore other stories <ArrowRight size={18} />
        </Link>
      </div>

      {/* Comment Section */}
      <CommentSection postId={id} />
    </div>
  );
}

function SuccessStoryContainerLoader() {
  return (
    <div>
      {/* Image loader */}
      <div className="flex-center mt-10 w-full gap-x-5">
        <Skeleton className="size-[400px]" />
        <Skeleton className="size-[400px]" />
      </div>

      {/* title loader */}
      <div className="mt-10 space-y-3">
        <Skeleton className="h-5 w-10/12 rounded-lg" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
        <Skeleton className="h-5 w-1/4 rounded-lg" />
      </div>

      {/* Description loader */}
      <div className="my-12 space-y-5">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="h-5 w-full" />
        ))}
      </div>
    </div>
  );
}
