import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import ShowTransformationForm from "./_components/ShowTransformationForm";

export const metadata = {
  title: "Share Your Transformation",
  description: "Share Your Transformation page",
};

export default function ShowTransformationPage() {
  return (
    <ResponsiveContainer>
      <ShowTransformationForm />
    </ResponsiveContainer>
  );
}
