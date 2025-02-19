"use client";

import CustomPagination from "@/components/CustomPagination/CustomPagination";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import SuccessStoryCard from "@/components/SuccessStoryCard/SuccessStoryCard";
import SuccessStoryCardSkeleton from "@/components/SuccessStoryCard/SuccessStoryCardSkeleton";
import { useGetTransformationPostsQuery } from "@/redux/api/customerApi";
import { useState } from "react";

export default function SuccessStoriesContainer() {
  const query = {};

  // ==================== Pagination ====================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  query["page"] = currentPage;
  query["limit"] = pageSize;

  /**
   * GET: Get all success stories(transformation posts)
   */
  const { data: transformationRes, isLoading } =
    useGetTransformationPostsQuery(query);

  const transformationPosts = transformationRes?.data || [];
  const meta = transformationRes?.meta || {};

  console.log(transformationPosts?.length);

  if (isLoading) {
    return <SuccessStoryCardSkeleton length={8} />;
  }

  return (
    <section>
      {transformationPosts?.length < 1 ? (
        <EmptyContainer />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {transformationPosts?.map((story) => (
              <SuccessStoryCard key={story._id} story={story} />
            ))}
          </div>

          {/* ==================== Pagination ==================== */}
          <CustomPagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={meta.total}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}
