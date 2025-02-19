import ScrollDownLottie from "@/components/custom-lotties/ScrollDownLottie";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import expertBg from "/public/images/experts/expertBg.png";
import ExpertsContainer from "./_components/ExpertsContainer";
import CustomHeroBanner from "@/components/shared/CustomHeroBanner/CustomHeroBanner";

export const metadata = {
  title: "Experts",
  description: "Experts page",
};

export default function ExpertsPage() {
  return (
    <div>
      {/* Top Section */}
      <CustomHeroBanner
        background={expertBg}
        heading="Find the Perfect Service for Your Needs"
        subHeading="Choose from a wide range of professional services to help you achieve your goals, whether it's at home, for your pet or even your business."
      />

      {/* Services */}
      <ResponsiveContainer>
        <ExpertsContainer />
      </ResponsiveContainer>
    </div>
  );
}
