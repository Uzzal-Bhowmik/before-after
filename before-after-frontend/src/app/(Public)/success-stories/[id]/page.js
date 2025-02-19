import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import SuccessStoryDetailsContainer from "./SuccessStoryDetailsContainer";
import CustomBreadcrumb from "@/components/CustomBreadcrumb/CustomBreadcrumb";
import { getBackendBaseUrl } from "@/config/envConfig";

// export async function generateMetadata({ params }) {
//   const { id } = await params;

//   const res = await fetch(getBackendBaseUrl() + `/transformation-posts/${id}`);
//   const transformationPost = await res.json();

//   return {
//     title: transformationPost?.data?.summary,
//     description: transformationPost?.data?.description,
//   };
// }

export const metadata = {
  title: "Success Story",
  description: "Success Story page",
};

export default async function DynamicSuccessStory({ params }) {
  const { id } = await params;
  return (
    <ResponsiveContainer>
      <SuccessStoryDetailsContainer id={id} />
    </ResponsiveContainer>
  );
}
