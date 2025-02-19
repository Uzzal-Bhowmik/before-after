"use client";

import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import ExpertCard from "../../ExpertCard/ExpertCard";
import avatar1 from "/public/images/Home/testimonials/1.png";
import avatar2 from "/public/images/Home/testimonials/2.png";
import avatar3 from "/public/images/Home/testimonials/3.png";
import thumb1 from "/public/images/Home/testimonials/picture.png";
import thumb2 from "/public/images/Home/testimonials/picture (2).png";
import thumb3 from "/public/images/Home/testimonials/picture (3).png";
import Autoplay from "embla-carousel-autoplay";
import TestimonialCard from "./_components/TestimonialCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TESTIMONIALS = [
  {
    _id: 1,
    name: "Michael Brown",
    userImg: avatar1,
    thumbImg: thumb1,
    comment:
      "I never knew my kitchen could look this amazing! The handyman turned my vision into reality and gave me a space I love to cook in.",
  },
  {
    _id: 2,
    name: "David Anderson",
    userImg: avatar2,
    thumbImg: thumb2,
    comment:
      "I can finally relax knowing my plumbing is fixed! The plumber was professional and efficient—highly recommend.",
  },
  {
    _id: 3,
    name: "Jessica Lee",
    userImg: avatar3,
    thumbImg: thumb3,
    comment:
      "I feel like a new person! The skin treatments transformed my skin and boosted my confidence immensely.",
  },
  {
    _id: 4,
    name: "Michael Brown",
    userImg: avatar1,
    thumbImg: thumb1,
    comment:
      "I never knew my kitchen could look this amazing! The handyman turned my vision into reality and gave me a space I love to cook in.",
  },
  {
    _id: 5,
    name: "David Anderson",
    userImg: avatar2,
    thumbImg: thumb2,
    comment:
      "I can finally relax knowing my plumbing is fixed! The plumber was professional and efficient—highly recommend.",
  },
];

export default function Testimonials() {
  return (
    <ResponsiveContainer classes={"my-20"}>
      <div className="text-center">
        <h1 className="primary-title text-center">Testimonials</h1>

        <div className="flex-center mx-auto mb-10 mt-2 w-1/2 gap-x-5">
          <div className="h-[1px] flex-grow bg-primary-blue" />
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="35"
              viewBox="0 0 34 35"
              fill="none"
            >
              <g clipPath="url(#clip0_317_10964)">
                <path
                  d="M11.8996 9.09486C12.0484 8.98323 12.2178 8.90202 12.398 8.85585C12.5782 8.80967 12.7658 8.79945 12.9499 8.82576C13.1341 8.85207 13.3113 8.9144 13.4714 9.00918C13.6315 9.10397 13.7713 9.22936 13.8829 9.37819C13.9946 9.52702 14.0758 9.69638 14.1219 9.8766C14.1681 10.0568 14.1783 10.2444 14.152 10.4285C14.1257 10.6127 14.0634 10.7899 13.9686 10.95C13.8738 11.1101 13.7484 11.2499 13.5996 11.3615C11.3839 13.0233 10.1146 14.6397 9.38785 16.0507C10.3857 15.7938 11.4388 15.8542 12.4008 16.2235C13.3627 16.5927 14.1857 17.2525 14.7554 18.111C15.3251 18.9696 15.6132 19.9843 15.5796 21.0142C15.546 22.044 15.1924 23.0378 14.568 23.8574C13.9435 24.677 13.0792 25.2817 12.0952 25.5875C11.1113 25.8932 10.0565 25.8849 9.07748 25.5635C8.09848 25.2421 7.24393 24.6238 6.63259 23.7943C6.02124 22.9649 5.68349 21.9656 5.66627 20.9354C5.48474 19.1956 5.73182 17.4378 6.38593 15.8155C7.23168 13.682 8.88493 11.3559 11.8996 9.09486ZM24.6496 9.09486C24.7984 8.98323 24.9678 8.90202 25.148 8.85585C25.3282 8.80967 25.5158 8.79945 25.6999 8.82576C25.8841 8.85207 26.0613 8.9144 26.2214 9.00918C26.3815 9.10397 26.5213 9.22936 26.6329 9.37819C26.7446 9.52702 26.8258 9.69638 26.8719 9.8766C26.9181 10.0568 26.9283 10.2444 26.902 10.4285C26.8757 10.6127 26.8134 10.7899 26.7186 10.95C26.6238 11.1101 26.4984 11.2499 26.3496 11.3615C24.1339 13.0233 22.8646 14.6397 22.1378 16.0507C23.1357 15.7938 24.1888 15.8542 25.1508 16.2235C26.1127 16.5927 26.9357 17.2525 27.5054 18.111C28.0751 18.9696 28.3632 19.9843 28.3296 21.0142C28.296 22.044 27.9424 23.0378 27.3179 23.8574C26.6935 24.677 25.8292 25.2817 24.8452 25.5875C23.8613 25.8932 22.8065 25.8849 21.8275 25.5635C20.8485 25.2421 19.9939 24.6238 19.3826 23.7943C18.7712 22.9649 18.4335 21.9656 18.4163 20.9354C18.2347 19.1956 18.4818 17.4378 19.1359 15.8155C19.9831 13.682 21.6349 11.3559 24.6496 9.09486Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_317_10964">
                  <rect
                    width="34"
                    height="34"
                    fill="white"
                    transform="translate(0 0.311523)"
                  />
                </clipPath>
              </defs>
            </svg>
          </span>

          <div className="h-[1px] flex-grow bg-primary-blue" />
        </div>
      </div>

      <section>
        <Carousel
          opts={{
            loop: false,
            duration: 50,
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 4200,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
        >
          <CarouselContent className="-ml-7">
            {TESTIMONIALS?.map((testimonial) => (
              <CarouselItem
                key={testimonial?._id}
                className="h-full pl-7 md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-14">
            <CarouselDots />
          </div>
        </Carousel>
      </section>

      <div className="flex-center mt-12 w-full">
        <Button variant="primary-blue" size="custom" asChild>
          <Link href="/success-stories">Showcase Your Transformation</Link>
        </Button>
      </div>
    </ResponsiveContainer>
  );
}
