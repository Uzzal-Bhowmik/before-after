import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";

import RequestContainer from "./RequestContainer";

export const metadata = {
  title: "View Request Details",
  description: "View Request Details page",
};

export default async function ViewRequest({ params }) {
  const { id } = await params;

  return (
    <ResponsiveContainer>
      <RequestContainer postId={id} />
    </ResponsiveContainer>
  );
}
