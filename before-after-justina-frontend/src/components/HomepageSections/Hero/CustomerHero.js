import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import { Button } from "@/components/ui/button";
import {
  textSlideUpChildVariant,
  textSlideUpParentVariant,
} from "@/utils/sharedMotionVariants";
import { motion } from "motion/react";
import Link from "next/link";

export default function CustomerHero() {
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
        className="text-center text-4xl font-bold text-white md:text-5xl xl:leading-snug 2xl:text-6xl"
      >
        Looking for real, verified <br /> transformations you can trust?
      </motion.h1>

      <motion.div
        variants={textSlideUpChildVariant()}
        key={2}
        className="mb-10 mt-5 px-10 text-center font-dm-sans text-sm text-light-gray md:text-base lg:text-lg xl:text-xl 2xl:text-[20px]"
      >
        Here, you follow the journey, see the change, and experience the
        truth—all in real time. And if you’re ready for your own transformation,
        you could be selected for a free before-and-after experience. No
        filters, no fluff, just authentic results. Ready to see what’s possible?
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
          <Link href={"/customer/place-request"}>
            Request for a service <AnimatedArrow />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
