import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import { Button } from "@/components/ui/button";
import {
  textSlideUpChildVariant,
  textSlideUpParentVariant,
} from "@/utils/sharedMotionVariants";
import { motion } from "motion/react";
import Link from "next/link";

export default function NonAuthHero() {
  return (
    <motion.div
      className="mx-auto w-full px-5 text-center md:px-10 lg:w-[85%] lg:px-0 xl:w-3/4 3xl:w-1/2"
      variants={textSlideUpParentVariant(1)}
      initial="initial"
      animate="animate"
    >
      <motion.h1
        variants={textSlideUpChildVariant()}
        key={1}
        className="text-center text-4xl font-bold text-white md:text-5xl lg:!leading-snug 2xl:text-6xl"
      >
        Discover Real Transformations, <br /> Verified Results.
      </motion.h1>

      <motion.div
        variants={textSlideUpChildVariant()}
        key={2}
        className="mb-10 mt-5 text-center font-dm-sans text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-[20px]"
      >
        <p className="text-light-gray">
          Explore authentic stories of change from trusted businesses.
        </p>
        <p className="text-light-gray">
          See results you can believe in, across industries.
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
          <Link href="/services">Explore Our Services</Link>
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
