import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import LoginForm from "./_components/LoginForm";

export const metadata = {
  title: "Login",
  description: "Login page",
};

export default function page() {
  return <LoginForm />;
}
