import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import UpdateTransformationForm from "./_components/UpdateTransformationForm";

export const metadata = {
  title: "Update Your Transformation Post",
  description: "Update Your Transformation Post page",
};

export default async function UpdateTransformationPage({ params }) {
  const { id } = await params;
  return (
    <ResponsiveContainer>
      <UpdateTransformationForm id={id} />
    </ResponsiveContainer>
  );
}
