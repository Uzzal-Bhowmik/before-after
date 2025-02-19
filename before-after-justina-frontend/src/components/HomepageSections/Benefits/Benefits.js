import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import BenefitsContainer from "./_components/BenefitsContainer";

export default function Benefits() {
  return (
    <ResponsiveContainer classes={"mt-28"}>
      <h1 className="primary-title text-center">
        Unlocking Value for Everyone
      </h1>

      <p className="mb-16 mt-3 text-center text-xl text-dark-gray">
        Explore how our platform benefits both customers and businesses through
        real, verified transformations.
      </p>

      <BenefitsContainer />
    </ResponsiveContainer>
  );
}
