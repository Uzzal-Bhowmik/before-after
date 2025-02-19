import { getBackendBaseUrl } from "@/config/envConfig";
import EditPostForm from "./_components/EditPostForm";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const res = await fetch(getBackendBaseUrl() + `/service-posts/${id}`);
  const servicePost = await res.json();

  return {
    title: servicePost?.data?.title,
    description: servicePost?.data?.description,
  };
}

export default async function EditPostPage({ params }) {
  const { id } = await params;

  return (
    <ResponsiveContainer>
      <EditPostForm postId={id} />
    </ResponsiveContainer>
  );
}
