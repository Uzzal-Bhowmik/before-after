import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import NotificationsContainer from "./_components/NotificationsContainer";

export const metadata = {
  title: "Your Notifications",
  description: "User Notifications page",
};

export default function NotificationPage() {
  return (
    <ResponsiveContainer>
      <NotificationsContainer />
    </ResponsiveContainer>
  );
}
