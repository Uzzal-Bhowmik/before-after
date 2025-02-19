"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import CustomPagination from "@/components/CustomPagination/CustomPagination";
import { useSearchParams } from "next/navigation";
import {
  useGetAllCategoriesQuery,
  useGetAllSubcategoriesQuery,
} from "@/redux/api/categoryApi";
import { AnimatePresence, motion } from "motion/react";
import CustomSkeleton from "@/components/CustomSkeleton/CustomSkeleton";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import ServicesSkeleton from "@/components/HomepageSections/Discover/_components/ServicesSkeleton";
import ServiceCard from "@/components/shared/ServiceCard/ServiceCard";
import { ChevronUp } from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  fadeUpWithBlurVariants,
  fadeVariants,
} from "@/utils/sharedMotionVariants";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ServicesContainer() {
  const [searchText, setSearchText] = useState("");
  const categoryId = useSearchParams().get("category");
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const query = {};

  // ==================== Pagination ====================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  query["page"] = currentPage;
  query["limit"] = pageSize;
  query["category"] = selectedCategoryId;

  // Use debounce for setting search query
  const [searchTerm] = useDebounce(searchText, 500);
  query["searchTerm"] = searchTerm;

  // Set category id if found in search params
  useEffect(() => {
    if (categoryId) setSelectedCategoryId(categoryId);

    // Scroll to services section
    const servicesSection = document.getElementById("services-section");
    servicesSection.scrollIntoView({ behavior: "smooth" });
  }, [categoryId]);

  /**
   * Categories are shown as filters on left side
   */
  const { data: categoryRes, isLoading: isCategoryLoading } =
    useGetAllCategoriesQuery();
  const categories = categoryRes?.data || [];

  /**
   * Subcategories are the services shown on right side
   */
  const { data: subcategoryRes, isLoading: isSubcategoryLoading } =
    useGetAllSubcategoriesQuery(query);
  const subcategories = subcategoryRes?.data || [];
  const subCategoriesMeta = subcategoryRes?.meta || {};

  console.log(subCategoriesMeta);

  return (
    <div className="py-10" id="services-section">
      {/* Search box */}
      <div className="relative mx-auto w-full md:w-[90%] lg:w-3/4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={20}
        />
        <Input
          className="w-full rounded-xl border border-primary-blue bg-transparent px-10 py-8 text-lg"
          placeholder="Search services..."
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Button
          variant="primary-blue"
          size="custom"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          Search
        </Button>
      </div>

      {/* Services Container */}
      <section className="flex-start-between my-16 gap-x-10">
        {/* Left -> Services Filter */}
        <div className="hidden lg:block lg:w-[30%]">
          <motion.div
            className="flex-center-between mb-5 gap-x-2 rounded-xl border border-black/40 px-3 py-1 transition-all duration-300 ease-in-out hover:bg-slate-100"
            role="button"
            onClick={() => setCategoryExpanded(!categoryExpanded)}
          >
            <h2 className="text-lg font-semibold">Category</h2>

            <ChevronUp
              size={18}
              className={cn(
                "transition-all duration-300 ease-in-out",
                !categoryExpanded && "rotate-180",
              )}
            />
          </motion.div>

          <AnimatePresence>
            {categoryExpanded && (
              <>
                {isCategoryLoading ? (
                  <CustomSkeleton
                    className="mt-5 space-y-3"
                    skeletonClass="w-full h-4 rounded-lg"
                    length={8}
                  />
                ) : (
                  <ScrollArea className="scroll-shadow h-[550px]">
                    <motion.div
                      className="space-y-4 px-4 pb-10"
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {categories?.map((category) => (
                        <motion.button
                          key={category._id}
                          className="flex items-center justify-start gap-x-2 text-left"
                          onClick={() => {
                            if (selectedCategoryId === category._id) {
                              return setSelectedCategoryId("");
                            }

                            setSelectedCategoryId(category._id);
                          }}
                          variants={fadeVariants}
                        >
                          {/* Custom checkbox */}
                          <div
                            className={cn(
                              "flex size-[18px] items-center justify-center rounded-md border border-gray-600 bg-transparent text-left transition-all duration-300 ease-out",
                              category._id === selectedCategoryId &&
                                "border-none bg-primary-blue text-white",
                            )}
                          >
                            {category._id === selectedCategoryId && (
                              <Check size={18} />
                            )}
                          </div>

                          <span className="text-left font-dm-sans">
                            {category.name}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  </ScrollArea>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Right -> Subcategories(services) */}

        {/* Show loading & empty */}
        <div className="w-full lg:flex-grow">
          {isSubcategoryLoading ? (
            <ServicesSkeleton length={9} className="2xl:grid-cols-3" />
          ) : (
            <>
              <p className="mb-5 font-dm-sans">
                {subCategoriesMeta?.total > 1
                  ? `✨ Total ${subCategoriesMeta?.total} services found`
                  : subCategoriesMeta?.total === 1
                    ? `${subCategoriesMeta?.total} service found`
                    : "0 service found"}

                {searchTerm && ` for "${searchTerm}"`}
              </p>

              {subcategories?.length === 0 ? (
                <EmptyContainer message="No services found" />
              ) : (
                <div>
                  {/* Service cards */}
                  <motion.section
                    variants={fadeUpWithBlurVariants}
                    initial="initial"
                    animate="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {subcategories?.map((subcategory) => (
                      <motion.div
                        key={subcategory?._id}
                        variants={fadeUpWithBlurVariants}
                      >
                        <ServiceCard service={subcategory} />
                      </motion.div>
                    ))}
                  </motion.section>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Pagination */}
      <div className="ml-auto mt-10 max-w-max">
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={subCategoriesMeta.total}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
