import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import ResponseTable from "./_components/ResponseTable";

export const metadata = {
  title: "View Responses",
  description: "View Responses page",
};

export default function ViewResponsesPage() {
  return (
    <ResponsiveContainer>
      <section>
        <h2 className="text-3xl font-semibold">Request From Professionals</h2>
        <h5 className="mt-2 font-medium text-dark-gray">
          Check out the request for your service posts from service providers
        </h5>
      </section>

      {/* Response Table */}
      <ResponseTable />
    </ResponsiveContainer>
  );
}
