"use client";

import CustomPagination from "@/components/CustomPagination/CustomPagination";
import ExpertCard from "@/components/ExpertCard/ExpertCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronUp } from "lucide-react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  useGetAllCategoriesQuery,
  useGetAllSubcategoriesQuery,
  useGetSubcategoryByIdQuery,
} from "@/redux/api/categoryApi";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import CustomSkeleton from "@/components/CustomSkeleton/CustomSkeleton";
import {
  fadeUpWithBlurVariants,
  fadeVariants,
} from "@/utils/sharedMotionVariants";
import { ChevronRight } from "lucide-react";
import { useGetAllServiceProvidersQuery } from "@/redux/api/serviceProviderApi";
import { useDebounce } from "use-debounce";
import ExpertCardSkeleton from "@/components/shared/ExpertCardSkeleton/ExpertCardSkeleton";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { MapPin } from "lucide-react";
import { useSetGeoLocation } from "@/hooks/useSetGeoLocation";
import { useSelector } from "react-redux";
import { selectLocation, setLocation } from "@/redux/features/geoLocationSlice";
import { useDispatch } from "react-redux";
import { successToast } from "@/utils/customToast";
import { ErrorModal } from "@/utils/customModal";
import { ArrowUpDown } from "lucide-react";
import MobileCategories from "./MobileCategories";
import { SlidersHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ExpertsContainer() {
  const [searchText, setSearchText] = useState("");
  const [serviceExpanded, setServiceExpanded] = useState(true);

  const [expandedCategory, setExpandedCategory] = useState("");
  const [ratingSortOrder, setRatingSortOrder] = useState("asc");
  const dispatch = useDispatch();

  // Get from search params
  const categoryIdParam = useSearchParams().get("category");
  const subcategoryIdParam = useSearchParams().get("subcategory");
  const subcategoryNameParam = useSearchParams().get("subcategoryName");
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    { _id: subcategoryIdParam, name: subcategoryNameParam } || {},
  );

  // Show nearby local states
  const setGeoLocationToStore = useSetGeoLocation(); // function to set user's geoLocation in redux store
  const geoLocation = useSelector(selectLocation);

  const query = {};

  // ==================== Location ====================
  if (geoLocation?.coordinates?.length > 1) {
    // check if both lat and long are 0
    if (geoLocation?.coordinates?.every((value) => value === 0)) {
      query["latitude"] = "";
      query["longitude"] = "";
    } else {
      query["latitude"] = geoLocation?.coordinates[1];
      query["longitude"] = geoLocation?.coordinates[0];
    }
  }
  // query["longitude"] =
  //   geoLocation?.coordinates?.length > 1 ? geoLocation?.coordinates[0] : "";
  // query["latitude"] =
  //   geoLocation?.coordinates?.length > 1 ? geoLocation?.coordinates[1] : "";

  // ==================== Pagination ====================
  const pageSize = 9;
  const [currentPage, setCurrentPage] = useState(1);
  query["page"] = currentPage;
  query["limit"] = pageSize;

  // Set sort query
  query["sort"] = ratingSortOrder === "asc" ? "avgRating" : "-avgRating";

  // Use debounce for setting search query
  const [searchTerm] = useDebounce(searchText, 500);
  query["searchTerm"] = searchTerm;

  // Selected subcategory
  query["services"] = selectedSubcategory?._id
    ? `[${selectedSubcategory?._id}]`
    : "";

  // Get all categories
  const { data: categoriesRes, isLoading: isCategoryLoading } =
    useGetAllCategoriesQuery();
  const categories = categoriesRes?.data || [];

  // Get experts (users?role=service_provider)
  const { data: expertsRes, isLoading: isExpertsLoading } =
    useGetAllServiceProvidersQuery(query);
  const experts = expertsRes?.data || [];
  const meta = expertsRes?.meta || {};

  // Show nearby handler
  const handleShowNearbyResults = async (findNearby) => {
    if (findNearby) {
      try {
        await setGeoLocationToStore();
        successToast("Location updated");
      } catch (err) {
        ErrorModal("Something went wrong");
      }

      return;
    }

    dispatch(setLocation({ coordinates: null }));
    successToast("Location removed");
  };

  // Set expanded category if search param is present
  useEffect(() => {
    if (categoryIdParam) {
      setExpandedCategory(categoryIdParam);
    }
  }, [categoryIdParam]);

  return (
    <div>
      <div className="my-10">
        {/* Search box */}
        <div className="relative mx-auto w-full md:w-[90%] lg:w-3/4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={20}
          />
          <Input
            className="w-full rounded-xl border border-primary-blue bg-transparent px-10 py-8 text-lg"
            placeholder="What service are you looking for?"
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

        {/* Experts Container */}
        <section className="flex-start-between my-16 flex-col gap-x-10 lg:flex-row">
          {/* Left -> Subcategories/Services Filter */}
          {/* Desktop version */}
          <div className="hidden lg:block lg:w-1/4">
            <motion.div
              className="flex-center-between mb-5 gap-x-2 rounded-xl border border-black/40 px-3 py-1 transition-all duration-300 ease-in-out hover:bg-slate-100"
              role="button"
              onClick={() => setServiceExpanded(!serviceExpanded)}
            >
              <h2 className="text-lg font-semibold">Services</h2>

              <ChevronUp
                size={18}
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  !serviceExpanded && "rotate-180",
                )}
              />
            </motion.div>

            <AnimatePresence>
              {serviceExpanded && (
                <>
                  {isCategoryLoading ? (
                    <CustomSkeleton
                      className={"mt-5 space-y-3"}
                      skeletonClass="w-full h-4 rounded-lg"
                      length={8}
                    />
                  ) : (
                    <ScrollArea className="scroll-shadow h-[550px]">
                      <motion.div
                        className="space-y-5 px-4 pb-10 font-dm-sans"
                        variants={fadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {categories?.map((category) => (
                          <>
                            <button
                              className={cn(
                                "flex-center-between w-full text-left",
                                category?.subcategory?.length === 0 &&
                                  "cursor-context-menu",
                              )}
                              onClick={() => {
                                if (category?.subcategory?.length === 0) return;

                                if (expandedCategory === category._id) {
                                  return setExpandedCategory("");
                                }

                                setExpandedCategory(category._id);
                              }}
                            >
                              {category.name}

                              {category?.subcategory?.length === 0 ? (
                                <span>(0)</span>
                              ) : (
                                <ChevronRight
                                  size={15}
                                  className={cn(
                                    "transition-all duration-300 ease-in-out",
                                    expandedCategory === category._id
                                      ? "rotate-90"
                                      : "",
                                  )}
                                />
                              )}
                            </button>

                            {/* Subcategories */}
                            {category?.subcategory?.length > 0 &&
                              expandedCategory === category._id && (
                                <div className="space-y-5 bg-slate-50 px-4 py-5">
                                  {category?.subcategory?.map((service) => (
                                    <motion.button
                                      key={service._id}
                                      className="flex w-full items-center justify-start gap-x-3 text-left"
                                      onClick={() => {
                                        if (
                                          selectedSubcategory?._id ===
                                          service._id
                                        ) {
                                          return setSelectedSubcategory({});
                                        }

                                        setSelectedSubcategory(service);
                                      }}
                                      variants={fadeVariants}
                                    >
                                      {/* Custom checkbox */}
                                      <div
                                        className={cn(
                                          "flex aspect-square size-4 items-center justify-center rounded border border-gray-600 bg-transparent transition-all duration-300 ease-out",
                                          service._id ===
                                            selectedSubcategory?._id &&
                                            "border-none bg-primary-blue text-white",
                                        )}
                                      >
                                        {service._id ===
                                          selectedSubcategory?._id && (
                                          <Check size={18} />
                                        )}
                                      </div>

                                      <span className="font-dm-sans">
                                        {service.name}
                                      </span>
                                    </motion.button>
                                  ))}
                                </div>
                              )}
                          </>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Right -> Experts Card */}
          <div className="w-full lg:w-10/12">
            {isExpertsLoading ? (
              <ExpertCardSkeleton length={9} className="2xl:grid-cols-3" />
            ) : (
              <>
                {experts?.length === 0 ? (
                  <EmptyContainer message="No service providers found" />
                ) : (
                  <div className="space-y-5">
                    <div className="flex-center-between font-dm-sans">
                      <p className="max-w-28 md:max-w-[50%] lg:max-w-[75%]">
                        {meta?.total > 1
                          ? `${meta?.total} experts found`
                          : `${meta?.total} expert found`}

                        {/* Search Term */}
                        {searchTerm && ` for "${searchTerm}"`}

                        {/* Selected subcategory */}
                        {selectedSubcategory?._id &&
                          ` for "${selectedSubcategory?.name}"`}

                        {/* Location */}
                        {geoLocation?.coordinates?.length > 1 &&
                          " near your area"}
                      </p>

                      <div className="flex-center-start gap-x-4">
                        {/* Find nearby me */}
                        {!geoLocation?.coordinates ? (
                          <button
                            className="flex-center-start gap-x-1"
                            onClick={() => handleShowNearbyResults(true)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#ca1717"
                                d="M12 2C7.589 2 4 5.589 4 9.995C3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12c0-4.411-3.589-8-8-8m0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
                              ></path>
                            </svg>
                            <span className="hidden lg:block">
                              Find nearby me
                            </span>
                          </button>
                        ) : (
                          <button
                            className="flex-center-start gap-x-1 font-dm-sans"
                            onClick={() => handleShowNearbyResults(false)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#ca1717"
                                d="M12 2C7.589 2 4 5.589 4 9.995C3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12c0-4.411-3.589-8-8-8m0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
                              ></path>
                            </svg>
                            <span className="hidden lg:block">Find all</span>
                          </button>
                        )}

                        {/* Sort by rating */}
                        <Button
                          variant={
                            ratingSortOrder === "desc" ? "default" : "outline"
                          }
                          className={cn("h-8 border border-dark-gray")}
                          onClick={() =>
                            ratingSortOrder === "asc"
                              ? setRatingSortOrder("desc")
                              : setRatingSortOrder("asc")
                          }
                        >
                          <ArrowUpDown /> Rating
                        </Button>

                        <MobileCategories
                          trigger={
                            <Button
                              variant="outline"
                              className="h-8 border border-dark-gray"
                            >
                              <SlidersHorizontal /> Services
                            </Button>
                          }
                          categories={categories}
                          isCategoryLoading={isCategoryLoading}
                          serviceExpanded={serviceExpanded}
                          setServiceExpanded={setServiceExpanded}
                          selectedSubcategory={selectedSubcategory}
                          setSelectedSubcategory={setSelectedSubcategory}
                          expandedCategory={expandedCategory}
                          setExpandedCategory={setExpandedCategory}
                        />
                      </div>
                    </div>

                    {/* Service cards */}
                    <motion.section
                      variants={fadeUpWithBlurVariants}
                      initial="initial"
                      animate="animate"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                    >
                      {experts?.map((expert) => (
                        <motion.div
                          key={expert?._id}
                          variants={fadeUpWithBlurVariants}
                        >
                          <ExpertCard data={expert} />
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
            total={meta?.total}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}
