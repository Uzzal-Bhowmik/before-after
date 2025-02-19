//Carousel.tsx
"use client";
import * as React from "react";
import Image from "next/image";
import {
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Eye } from "lucide-react";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Carousel component
export default function ImageGallery({ staticImages, className }) {
  // State variables
  const [selectedImage, setSelectedImage] = React.useState(staticImages[0]);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Function to handle next image
  const handleNext = () => {
    const nextIndex = (selectedImageIndex + 1) % staticImages.length;
    setSelectedImage(staticImages[nextIndex]);
    setSelectedImageIndex(nextIndex);
  };

  // Function to handle previous image
  const handlePrev = () => {
    const prevIndex =
      (selectedImageIndex - 1 + staticImages.length) % staticImages.length;
    setSelectedImage(staticImages[prevIndex]);
    setSelectedImageIndex(prevIndex);
  };

  // Render
  return (
    <div className="z-[9999] w-max">
      {/* Scrollable area */}
      <div className="scroll-hide z-[9999] flex w-max overflow-hidden">
        {/* Image gallery */}
        {staticImages?.map((image, index) => (
          <AlertDialog key={index}>
            <AlertDialogTrigger asChild>
              <figure className="z-[9999] shrink-0">
                <div className="mr-4 overflow-hidden rounded-md">
                  <div className="group relative">
                    {/* Preview overlay */}
                    <div className="flex-center invisible absolute inset-0 z-[9999] h-full cursor-pointer gap-x-2 rounded-md bg-gray-600/50 text-lg text-white opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100">
                      <Eye size={20} />
                      <p>Preview</p>
                    </div>

                    {/* Image */}
                    <Image
                      src={image}
                      alt={"Image " + (index + 1)}
                      className={cn(
                        "aspect-square h-[250px] w-[350px] cursor-pointer rounded-lg border object-fill opacity-0 transition-opacity duration-100",
                        className,
                      )}
                      width={1200}
                      height={1200}
                      onClick={() => {
                        setSelectedImage(image);
                        setSelectedImageIndex(index);
                      }}
                      onLoad={(event) => {
                        const target = event.target;
                        target.classList.remove("opacity-0");
                      }}
                    />
                  </div>
                </div>
              </figure>
            </AlertDialogTrigger>

            {/* Dialog content */}
            <AlertDialogContent
              className="grid-rows-carousel z-[9999] h-full w-full max-w-full p-2"
              style={{
                color: "var(--foreground)",
                backgroundColor: "var(--card)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Dialog header */}
              <AlertDialogHeader className="absolute left-5 top-0 z-[9999] mx-auto h-12">
                <span className="my-auto text-2xl font-light text-gray-300">
                  {selectedImageIndex + 1}/{staticImages.length}
                </span>
              </AlertDialogHeader>

              {/* Image display and navigation */}
              <div className="z-[9999] flex h-full flex-col items-center">
                <div className="flex-center relative h-full w-full">
                  {/* Selected image */}
                  <Image
                    src={selectedImage}
                    alt="Selected Image"
                    // fill={true}
                    className="max-w-auto m-auto h-3/4 max-h-[95%] w-auto opacity-0 transition-opacity duration-75"
                    height={1200}
                    width={1200}
                    onLoad={(event) => {
                      const target = event.target;
                      target.classList.remove("opacity-0");
                    }}
                  />
                </div>

                {/* Navigation buttons */}
                {staticImages?.length > 1 && (
                  <div className="z-[9999] flex items-center justify-between gap-2">
                    {/* Previous button */}
                    <Button
                      variant="outline"
                      className="cursor-pointer bg-white disabled:bg-white/75"
                      onClick={handlePrev}
                    >
                      <ChevronLeft />
                      Prev
                    </Button>

                    {/* Next button */}
                    <Button
                      variant="outline"
                      className="cursor-pointer bg-white disabled:bg-white/75"
                      onClick={handleNext}
                    >
                      Next
                      <ChevronRight />
                    </Button>
                  </div>
                )}
              </div>
              <AlertDialogCancel className="absolute right-2 top-2 z-[9999]">
                <button className="rounded-full bg-white p-1">
                  <X size={20} className="text-black" />
                </button>
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
    </div>
  );
}
