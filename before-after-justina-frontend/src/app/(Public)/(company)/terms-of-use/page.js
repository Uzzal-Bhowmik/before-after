import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import TermsConditionContainer from "./_components/TermsConditionContainer";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use page",
};

export default function TermsConditionPage() {
  return (
    <ResponsiveContainer className="lg:mx-auto lg:w-3/4">
      <h1 className="text-primary-black mb-10 text-5xl font-extrabold">
        Terms of Use
      </h1>

      <TermsConditionContainer />
    </ResponsiveContainer>
  );
}
