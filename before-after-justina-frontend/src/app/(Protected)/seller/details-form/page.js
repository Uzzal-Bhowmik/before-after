import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import DetailsFormContainer from "./_components/DetailsFormContainer";

export const metadata = {
  title: "Service Provider Details",
  description: "Seller Details page",
};

export default function SellerDetailsFormPage() {
  return (
    <ResponsiveContainer>
      <DetailsFormContainer />
    </ResponsiveContainer>
  );
}
