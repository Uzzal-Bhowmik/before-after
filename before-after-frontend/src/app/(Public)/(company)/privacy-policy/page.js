import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import PrivacyPolicyContainer from "./_components/PrivacyPolicyContainer";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy page",
};

export default function AboutUsPage() {
  return (
    <ResponsiveContainer className="lg:mx-auto lg:w-3/4">
      <h1 className="text-primary-black mb-10 text-5xl font-extrabold">
        Privacy Policy
      </h1>

      <PrivacyPolicyContainer />
    </ResponsiveContainer>
  );
}
