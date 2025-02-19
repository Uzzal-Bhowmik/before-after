import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import CustomerProfileContainer from "./_components/CustomerProfileContainer";

export const metadata = {
  title: "Profile",
  description: "Profile page",
};

export default function page() {
  return (
    <ResponsiveContainer classes={"md:mt-16"}>
      <CustomerProfileContainer />
    </ResponsiveContainer>
  );
}
