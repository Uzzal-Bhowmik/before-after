import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import UpdateActivityForm from "./_components/UpdateActivityForm";

export const metadata = {
  title: "Update Activity Post",
  description: "Update Activity Post page",
};

export default async function UpdateActivityPage({ params }) {
  const { id } = await params;

  return (
    <ResponsiveContainer>
      <UpdateActivityForm id={id} />
    </ResponsiveContainer>
  );
}
