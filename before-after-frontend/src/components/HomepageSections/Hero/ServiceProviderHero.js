import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import { Button } from "@/components/ui/button";
import {
  textSlideUpChildVariant,
  textSlideUpParentVariant,
} from "@/utils/sharedMotionVariants";
import { motion } from "motion/react";
import Link from "next/link";

export default function ServiceProviderHero() {
  return (
    <motion.div
      className="mx-auto w-full px-5 text-center md:px-10 lg:w-[85%] lg:px-0 xl:w-3/4 3xl:w-1/2"
      variants={textSlideUpParentVariant(0.75)}
      initial="initial"
      animate="animate"
    >
      <motion.h1
        variants={textSlideUpChildVariant()}
        key={1}
        className="text-center text-4xl font-bold text-white md:text-5xl 2xl:text-6xl 2xl:leading-snug"
      >
        Only the Genuine Make It Here
      </motion.h1>

      <motion.div
        variants={textSlideUpChildVariant()}
        key={2}
        className="mb-10 mt-5 text-center font-dm-sans text-sm md:text-base lg:text-lg 2xl:text-[20px]"
      >
        <p className="text-light-gray">
          If your product or service delivers real, visible transformations, let
          it speak for itself. Confident in your unmatched results? Offer a free
          trial and let everyone see the difference, live and unfiltered. No
          gimmicks, no flashy ads—just proven success. Ready to make your mark?
        </p>
      </motion.div>

      <motion.div
        variants={textSlideUpChildVariant()}
        key={3}
        className="flex-center mx-auto w-full flex-col gap-x-5 gap-y-3 px-5 md:flex-row lg:w-3/4 lg:px-0 2xl:w-[65%]"
      >
        <Button
          size="custom"
          variant="secondary"
          className="w-full md:w-1/2"
          asChild
        >
          <Link href="/services">Explore Services</Link>
        </Button>
        <Button
          size="custom"
          variant="primary-blue"
          className="group w-full md:w-1/2"
          asChild
        >
          <Link href={"/login"}>
            Get Started <AnimatedArrow />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
