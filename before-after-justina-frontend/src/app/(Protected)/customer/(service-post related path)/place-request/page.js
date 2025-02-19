import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import RequestsContainer from "./_components/RequestsContainer";

export const metadata = {
  title: "Your requests",
  description: "Customer requests page",
};
export default function CustomerRequestsPage() {
  return (
    <ResponsiveContainer>
      <RequestsContainer />
    </ResponsiveContainer>
  );
}
