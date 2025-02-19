import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import LeadsPageContainer from "./_components/LeadsPageContainer";

export const metadata = {
  title: "Leads",
  description: "Seller Leads page",
};

export default function SellerLeadsPage() {
  return (
    <ResponsiveContainer>
      <LeadsPageContainer />
    </ResponsiveContainer>
  );
}
