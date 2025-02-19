"use client";

import { Button } from "@/components/ui/button";
import {
  BoxStarsSvg,
  BoxWithCheckSvg,
  CheckSvg,
  LightBulbSvg,
  MessageSvg,
  ShakeHandSvg,
} from "./benefitSvgs";
import Link from "next/link";
import { motion } from "motion/react";

// motion variants
const slideLeftVariant = {
  initial: {
    x: -100,
    opacity: 0,
    filter: "blur(5px)",
  },
  animate: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 40,
      delay: 0.5,
    },
  },
};

const slideRightVariant = {
  initial: {
    x: 100,
    opacity: 0,
    filter: "blur(5px)",
  },
  animate: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 40,
      delay: 0.5,
    },
  },
};

const data = [
  {
    _id: 1,
    title: "Benefits for Customers",
    benefits: [
      {
        icon: <LightBulbSvg />,
        text: "Discover real transformation stories to inspire your journey.",
      },
      {
        icon: <BoxStarsSvg />,
        text: "Gain confidence in products and services through verified results.",
      },
      {
        icon: <MessageSvg />,
        text: "Make smarter choices with real testimonials and data.",
      },
    ],
    buttonText: "Explore Stories",
    buttonLink: "/success-stories",
  },
  {
    _id: 2,
    title: "Benefits for Businesses",
    benefits: [
      {
        icon: <ShakeHandSvg />,
        text: "Establish trust by showcasing real customer transformations.",
      },
      {
        icon: <BoxWithCheckSvg />,
        text: "Demonstrate the effectiveness of your products or services.",
      },
      {
        icon: <CheckSvg />,
        text: "Leverage verified stories to draw in potential clients.",
      },
    ],
    buttonText: "Start Your Journey",
    buttonLink: "/sign-up",
  },
];

export default function BenefitsContainer() {
  return (
    <section className="mx-auto flex w-full flex-col justify-between gap-10 md:w-[80%] lg:mx-auto lg:w-[85%] lg:flex-row lg:items-stretch 2xl:w-3/4">
      {data?.map(({ _id, title, benefits, buttonText, buttonLink }, idx) => (
        <motion.div
          key={_id}
          className="flex flex-col items-center justify-between gap-y-12 overflow-hidden rounded-lg bg-foundation-accent-800 p-7 text-white lg:p-10"
          variants={idx === 0 ? slideLeftVariant : slideRightVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div>
            <h4 className="mb-8 text-center text-3xl font-semibold">{title}</h4>

            <div className="space-y-7">
              {benefits.map(({ icon, text }) => (
                <div key={text} className="flex-start-start gap-x-5">
                  <span>{icon}</span>
                  <p className="text-lg">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            size="custom"
            className="rounded-lg bg-foundation-accent-400 px-16 font-semibold text-black hover:bg-foundation-accent-400/90 hover:shadow-lg"
            asChild
          >
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </motion.div>
      ))}
    </section>
  );
}
