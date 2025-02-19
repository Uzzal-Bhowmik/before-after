import Benefits from "@/components/HomepageSections/Benefits/Benefits";
import DiscoverServices from "@/components/HomepageSections/Discover/DiscoverServices";
import Experts from "@/components/HomepageSections/Experts/Experts";
import Faq from "@/components/HomepageSections/Faq/Faq";
import Hero from "@/components/HomepageSections/Hero/Hero";
import HowItWorks from "@/components/HomepageSections/HowItWorks/HowItWorks";
import Pricing from "@/components/HomepageSections/Pricing/Pricing";
import SuccessStories from "@/components/HomepageSections/SuccessStories/SuccessStories";
import Testimonials from "@/components/HomepageSections/Testimonials/Testimonials";
import Transformations from "@/components/HomepageSections/Transformations/Transformations";

export const metadata = {
  title: "Home | Before After Story",
  description:
    "This is the official home page of Before After - a platform  that helps people discover real transformation with verified results.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Transformations />
      <HowItWorks />
      <SuccessStories />
      <DiscoverServices />
      <Experts />
      <Benefits />
      {/* <Pricing /> */}
      {/* <Testimonials /> */}
      <Faq />
    </>
  );
}
