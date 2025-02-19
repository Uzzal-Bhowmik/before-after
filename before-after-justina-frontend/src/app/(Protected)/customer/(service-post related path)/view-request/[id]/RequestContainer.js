"use client";

import {
  useDeleteServicePostMutation,
  useGetSingleServicePostQuery,
} from "@/redux/api/customerApi";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BellRing } from "lucide-react";
import Image from "next/image";
import Preview from "@/components/Preview/Preview";
import { useState } from "react";
import ImagePreviewer from "@/components/ui/image-previewer";
import { DotDivider } from "@/utils/dividers";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { CheckCircle } from "lucide-react";
import { Star } from "lucide-react";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import Link from "next/link";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";
import { useRouter } from "next/navigation";

export default function RequestContainer({ postId }) {
  const router = useRouter();
  const [imagePreviewIndex, setImagePreviewIndex] = useState(-1); // img index -1 to hide lightbox

  /**
   * GET: Get single service post details
   */
  const { data: servicePost, isLoading } = useGetSingleServicePostQuery(
    postId,
    { skip: !postId },
  );

  /**
   * DELETE: Delete post handler
   */
  const [deletePost, { isLoading: isDeleting }] =
    useDeleteServicePostMutation();
  const handleDeletePost = async () => {
    if (!postId) {
      return ErrorModal("Post not found!");
    }

    ConfirmModal("Delete Post?", "This post will be permanently deleted").then(
      async (res) => {
        if (res.isConfirmed) {
          try {
            await deletePost(postId).unwrap();

            SuccessModal("Post deleted successfully!");
            router.push("/customer/place-request");
          } catch (error) {
            ErrorModal(error?.data?.message || error?.message);
          }
        }
      },
    );
  };

  console.log(servicePost);

  if (isLoading) {
    return (
      <div className="flex-center h-[75vh]">
        <CustomLoader color="var(--primary-blue)" variant="lg" />
      </div>
    );
  }

  return (
    <div>
      <section>
        <h2 className="text-3xl font-semibold">{servicePost?.title}</h2>

        <div className="flex-center-start mt-2 gap-x-4">
          <p className="font-medium text-gray-500">
            {servicePost?.category?.name}
          </p>

          <DotDivider className="bg-gray-500" />

          <p className="font-medium text-gray-500">
            Posted on -{" "}
            {servicePost?.createdAt &&
              format(servicePost?.createdAt, "dd MMM yyyy")}
          </p>
        </div>

        <div className="flex-center-start mt-4 gap-x-2">
          <Badge className="rounded-full py-1" variant="approved">
            <BellRing size={16} className="mr-1" />{" "}
            {servicePost?.consultationType}
          </Badge>

          <Badge
            className="!m-0 rounded-full py-1 capitalize"
            variant={servicePost?.status}
          >
            {servicePost?.status}
          </Badge>

          <Badge
            className="!m-0 rounded-full py-1 capitalize"
            variant={servicePost?.isFree ? "costFree" : "costly"}
          >
            {servicePost?.isFree ? "Free of Cost" : "Requesting Quote"}
          </Badge>
        </div>
      </section>

      <div className="my-8 h-0.5 w-full border border-b border-dashed" />

      <section class="space-y-8 text-lg">
        {/* Images gallery */}
        <div className="flex-center-start flex-wrap gap-4">
          {servicePost?.images?.map((img, idx) => (
            <Preview
              key={idx}
              className="max-w-1/4 h-[250px] w-auto rounded-lg"
              onClick={() => setImagePreviewIndex(idx)}
            >
              <Image
                src={img?.url}
                alt="Document"
                height={1200}
                width={1200}
                className="h-full w-full rounded-lg"
              />
            </Preview>
          ))}

          <ImagePreviewer
            imageUrls={servicePost?.images?.map((img) => img.url)}
            previewImgIndex={imagePreviewIndex}
            setPreviewImgIndex={setImagePreviewIndex}
          />
        </div>

        {/* Post details */}
        <ContentWrapper content={servicePost?.description} />
      </section>

      {/* Buttons */}
      <section className="mt-16">
        {/* Show edit/delete btn if pending */}
        {servicePost?.status === "pending" && (
          <section className="flex-center-between">
            <Button
              variant="destructive"
              size="custom"
              className="w-1/4"
              onClick={handleDeletePost}
              loading={isDeleting}
            >
              <Trash2 /> Delete Post
            </Button>

            <Button
              variant="primary-blue"
              size="custom"
              className="w-1/4"
              asChild
            >
              <Link href={`/customer/edit-post/${servicePost?._id}`}>
                <Edit /> Edit Post
              </Link>
            </Button>
          </section>
        )}

        {servicePost?.status === "ongoing" && (
          <Button variant="success" size="custom" className="w-1/4">
            <CheckCircle /> Mark as Completed
          </Button>
        )}

        {servicePost?.status === "completed" && (
          <Button variant="primary-blue" size="custom" className="w-1/4">
            <Star /> Share Review
          </Button>
        )}
      </section>
    </div>
  );
}
