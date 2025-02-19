import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import CreatePostForm from "./_components/CreatePostForm";

export const metadata = {
  title: "Create Post",
  description: "Create Post page",
};

export default function page() {
  return (
    <ResponsiveContainer>
      <CreatePostForm />
    </ResponsiveContainer>
  );
}
