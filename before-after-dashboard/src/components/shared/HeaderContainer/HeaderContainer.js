"use client";

import { Badge, Button } from "antd";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout } from "antd";
import { AlignJustify } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { useEffect } from "react";
import { socket } from "@/socket";
import toast from "react-hot-toast";
import { useGetMyNotificationQuery } from "@/redux/api/notificationApi";
const { Header } = Layout;

export default function HeaderContainer({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const navbarTitle = pathname.split("/admin")[1];
  const { data: notificationData, refetch } = useGetMyNotificationQuery({
    read: false,
  });

  const router = useRouter();
  const userId = useSelector((state) => state.auth?.user?.userId);
  const token = useSelector((state) => state.auth?.token);

  const notification = useSelector((state) => state.notification.notification);

  useEffect(() => {
    if (notification?.message) {
      toast.info(notification?.message);
    }
  }, [notification]);

  //socket \
  useEffect(() => {
    socket.auth = { token };
    socket.connect();
    const handleNotificationEvent = (data) => {
      if (data) {
        refetch();
        data = null;
      }
    };

    socket.on("notification::" + userId, handleNotificationEvent);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off(userId, handleNotificationEvent);
      socket.disconnect();
    };
  }, [userId, refetch, token]);

  if (!userId) {
    router.push("/login");
  }
  // Get user info
  const { data: userRes, refetch: userRefetch } = useGetProfileQuery(null, {
    skip: !userId,
  });

  const user = userRes?.data || {};

  return (
    <Header
      style={{
        backgroundColor: "var(--demin-primary-100)",
        height: "80px",
        display: "flex",
        alignItems: "center",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 0,
        paddingRight: "40px",
      }}
    >
      {/* Collapse Icon */}
      <div className="flex items-center gap-x-2">
        <Button
          type="text"
          icon={<AlignJustify strokeWidth={3} size={25} />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <h1 className="text-3xl font-semibold capitalize font-dmSans">
          {navbarTitle.length > 1
            ? navbarTitle.replaceAll("/", " ").replaceAll("-", " ")
            : "dashboard"}
        </h1>
      </div>

      {/* Right --- notification, user profile */}
      <div className="flex items-center gap-x-6">
        {/* <button>
          <Search color="#1C1B1F" size={22} strokeWidth={2.5} />
        </button> */}

        <Link href="/admin/notification" className="relative !leading-none">
          <Badge count={notificationData?.data?.length || 0} overflowCount={10}>
            <Bell
              className="rounded-full cursor-pointer text-orange"
              fill="#1C1B1F"
              stroke="#1C1B1F"
              size={22}
            />
          </Badge>
          {/* Notification dot indicator */}
          {/* <div className="bg-[#64B445] absolute -top-1.5 -right-1 size-3 rounded-full" /> */}
        </Link>

        {/* User */}
        <Link
          href={"/admin/profile"}
          className="flex items-center text-black group gap-x-2 hover:text-primary-blue"
        >
          {user.profile ? (
            <Image
              src={user?.profile}
              alt="Admin avatar"
              width={52}
              height={52}
              className="h-[50px] w-[50px] rounded-full border-2 border-primary-green p-0.5 group-hover:border"
            />
          ) : (
            <div className="flex items-center justify-center bg-white rounded-full font-500 size-10">
              <p className="text-16">
                {user?.email?.slice(0, 2)?.toUpperCase()}
              </p>
            </div>
          )}

          <h4 className="text-lg font-semibold">{user?.name}</h4>
        </Link>
      </div>
    </Header>
  );
}
