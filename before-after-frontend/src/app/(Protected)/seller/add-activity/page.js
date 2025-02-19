import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import AddActivityForm from "./_components/AddActivityForm";

export const metadata = {
  title: "Add Activity",
  description: "Add Activity page",
};

export default function AddActivityPage() {
  if (typeof window !== "undefined") window.scrollTo(0, 0);
  return (
    <ResponsiveContainer>
      <AddActivityForm />
    </ResponsiveContainer>
  );
}
