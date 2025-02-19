import CustomSkeleton from "@/components/CustomSkeleton/CustomSkeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { fadeVariants } from "@/utils/sharedMotionVariants";
import { Check } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function MobileCategories({
  trigger,
  categories,
  isCategoryLoading,
  serviceExpanded,
  setServiceExpanded,
  selectedSubcategory,
  setSelectedSubcategory,
  expandedCategory,
  setExpandedCategory,
}) {
  return (
    <Sheet>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Services</SheetTitle>

          <AnimatePresence>
            {serviceExpanded && (
              <>
                {isCategoryLoading ? (
                  <CustomSkeleton
                    className={"mt-5 space-y-3"}
                    skeletonClass="w-full h-4 rounded-lg !mt-10"
                    length={8}
                  />
                ) : (
                  <motion.div
                    className="!mt-10 space-y-5 px-4 font-dm-sans"
                    variants={fadeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {categories?.map((category) => (
                      <>
                        <button
                          className={cn(
                            "flex-center-between w-full",
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
                            <div className="bg-slate-50 px-4 py-2">
                              {category?.subcategory?.map((service) => (
                                <motion.button
                                  key={service._id}
                                  className="flex w-full items-center justify-start gap-x-2"
                                  onClick={() => {
                                    if (
                                      selectedSubcategory?._id === service._id
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
                                      "flex size-4 items-center justify-center rounded border border-gray-600 bg-transparent transition-all duration-300 ease-out",
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
                )}
              </>
            )}
          </AnimatePresence>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
