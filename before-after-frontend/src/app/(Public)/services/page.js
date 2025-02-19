import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import serviceBg from "/public/images/services/services-bg.png";
import ScrollDownLottie from "@/components/custom-lotties/ScrollDownLottie";
import ServicesContainer from "./_components/ServicesContainer";
import { Suspense } from "react";
import CustomHeroBanner from "@/components/shared/CustomHeroBanner/CustomHeroBanner";

export const metadata = {
  title: "Explore Various Services",
  description: "Services page",
};

export default function ServicesPage() {
  return (
    <div>
      {/* Top Section */}
      <CustomHeroBanner
        background={serviceBg}
        heading="Find the Perfect Service for Your Needs"
        subHeading={
          "Choose from a wide range of professional services to help you achieve your goals, whether it's at home, for your pet or even your business."
        }
      />

      {/* Services */}
      <ResponsiveContainer>
        <ServicesContainer />
      </ResponsiveContainer>
    </div>
  );
}
