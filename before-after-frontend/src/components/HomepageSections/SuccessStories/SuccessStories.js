"use client";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SuccessStoryCard from "@/components/SuccessStoryCard/SuccessStoryCard";
import { useGetTransformationPostsQuery } from "@/redux/api/customerApi";
import SuccessStoryCardSkeleton from "@/components/SuccessStoryCard/SuccessStoryCardSkeleton";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { fadeUpWithBlurVariants } from "@/utils/sharedMotionVariants";
import { motion } from "motion/react";

export default function SuccessStories() {
  /**
   * GET: Get transformation posts
   * Note: These transformation posts are posted by customers
   */
  const { data: transformationPostsRes, isLoading } =
    useGetTransformationPostsQuery();
  const transformationPosts = transformationPostsRes?.data || [];

  return (
    <ResponsiveContainer id="success-stories" classes={"mt-28"}>
      <h1 className="primary-title mb-10 text-center">
        Transforming Dreams into Reality: <br /> Customer{" "}
        <span className="text-primary-blue">Success Stories</span>
      </h1>

      {/* View all button */}
      <Link href="/success-stories">
        <button className="flex-center group mb-3 ml-auto w-max gap-x-2 text-sm font-medium text-gray-600 transition-all hover:text-primary-blue lg:text-base">
          View All{" "}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-in-out group-hover:translate-x-1"
          />
        </button>
      </Link>

      {/* Success Story Cards */}
      {isLoading ? (
        <SuccessStoryCardSkeleton />
      ) : (
        <>
          {transformationPosts?.length === 0 ? (
            <EmptyContainer className="my-24" />
          ) : (
            <motion.div
              variants={fadeUpWithBlurVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
            >
              {transformationPosts?.map((story) => (
                <motion.div variants={fadeUpWithBlurVariants} key={story?._id}>
                  <SuccessStoryCard key={story?._id} story={story} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </ResponsiveContainer>
  );
}
