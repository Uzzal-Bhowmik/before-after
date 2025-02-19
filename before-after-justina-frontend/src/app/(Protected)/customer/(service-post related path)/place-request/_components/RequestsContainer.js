"use client";
import CustomerRequestCard from "./CustomerRequestCard";
import { useEffect, useState } from "react";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import {
  useGetMyServicePostsQuery,
  useGetMyTransformationPostsQuery,
} from "@/redux/api/customerApi";
import CustomPagination from "@/components/CustomPagination/CustomPagination";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import SuccessStoryCardSkeleton from "@/components/SuccessStoryCard/SuccessStoryCardSkeleton";
import SuccessStoryCard from "@/components/SuccessStoryCard/SuccessStoryCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { fadeUpWithBlurVariants } from "@/utils/sharedMotionVariants";
import { SlidersHorizontal } from "lucide-react";
import { constants } from "@/constants/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { useSocket } from "@/context/SocketContextApi";

export default function RequestsContainer() {
  const query = {};
  const userId = useSelector(selectUser)?.userId;
  const [selectedStatus, setSelectedStatus] = useState("");
  const { socket } = useSocket();

  // ============ Pagination and Filter for `My Requests` ============
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  query["page"] = currentPage;
  query["limit"] = pageSize;
  query["status"] = selectedStatus;

  /**
   * GET: Get my service posts
   */
  const {
    data: servicePostsRes,
    isLoading,
    refetch,
  } = useGetMyServicePostsQuery(query);
  const myServicePosts = servicePostsRes?.data || [];
  const meta = servicePostsRes?.meta || {};

  /**
   * GET: Get my transformation posts
   */
  const {
    data: transformationPostsRes,
    isLoading: isTransformationPostsLoading,
  } = useGetMyTransformationPostsQuery(null, { skip: !userId });
  const transformationPosts = transformationPostsRes?.data || [];

  return (
    <>
      <section className="flex-center-end mb-12 flex-col gap-x-4 gap-y-3 md:flex-row">
        <Button
          className="w-full md:w-3/4 lg:w-1/3 2xl:w-1/4"
          variant="primary-blue"
          size="custom"
          asChild
        >
          <Link href="/customer/create-post">
            <Edit /> Post new request
          </Link>
        </Button>

        <Button
          className="w-full md:w-3/4 lg:w-1/3 2xl:w-1/4"
          variant="primary-blue"
          size="custom"
          asChild
        >
          <Link href="/customer/show-transformation">
            <Sparkles /> Showcase Your Transformation
          </Link>
        </Button>
      </section>

      {/* My Requests */}
      <section id="service-posts">
        <div className="mb-5 flex items-center justify-between gap-x-4">
          <h3 className="text-3xl font-semibold">My Requests</h3>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="w-max border border-primary-gray lg:w-[200px]"
              >
                <SlidersHorizontal /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] font-dm-sans">
              {constants.SERVICE_POST_STATUS.map((status) => (
                <DropdownMenuItem
                  key={status}
                  className="flex-center-between capitalize"
                  onClick={() => {
                    if (selectedStatus === status) return setSelectedStatus("");
                    setSelectedStatus(status);
                  }}
                >
                  {status} {selectedStatus === status && <Check size={18} />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Loader */}
        {isLoading && (
          <div className="flex-center h-[20vh]">
            <CustomLoader color="var(--primary-blue)" />
          </div>
        )}

        {/* ============== All Service Post Requests ================== */}
        {myServicePosts?.length < 1 && !isLoading ? (
          <EmptyContainer message="No requests found" />
        ) : (
          <div>
            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
              variants={fadeUpWithBlurVariants}
              initial="initial"
              animate="animate"
            >
              {myServicePosts?.map((post) => (
                <motion.div variants={fadeUpWithBlurVariants} key={post.id}>
                  <CustomerRequestCard post={post} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <CustomPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              total={meta.total}
            />
          </div>
        )}
      </section>

      {/* ===================== My Transformation Posts ========================== */}
      <section id="transformation-posts" className="my-10">
        <h3 className="mb-5 text-3xl font-semibold">My Transformation Posts</h3>

        {/* All Service Post Requests */}
        {transformationPosts?.length < 1 && !isLoading ? (
          <EmptyContainer message="No posts found" />
        ) : (
          <>
            {isTransformationPostsLoading ? (
              <SuccessStoryCardSkeleton />
            ) : (
              <motion.div
                className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4"
                variants={fadeUpWithBlurVariants}
                initial="initial"
                animate="animate"
              >
                {transformationPosts?.map((story) => (
                  <motion.div
                    key={story?._id}
                    variants={fadeUpWithBlurVariants}
                  >
                    <SuccessStoryCard story={story} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </section>
    </>
  );
}
