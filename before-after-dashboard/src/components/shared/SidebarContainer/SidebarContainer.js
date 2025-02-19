"use client";

import "./Sidebar.css";
import logo from "@/assets/logos/Logo.svg";
import { logout } from "@/redux/features/authSlice";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { CircleDollarSign } from "lucide-react";
import { Shapes } from "lucide-react";
import { ScrollText } from "lucide-react";
import { LogOut } from "lucide-react";
import { SlidersVertical } from "lucide-react";
import { Podcast } from "lucide-react";
import { CircleUser } from "lucide-react";
import { House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const SidebarContainer = ({ collapsed }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Logout handler
  const onClick = (e) => {
    if (e.key === "logout") {
      dispatch(logout());
      router.push("/");

      Success_model({ title: "Logout successful" });
    }
  };

  const navLinks = [
    {
      key: "dashboard",
      icon: <House size={21} strokeWidth={2} />,
      label: <Link href={"/admin/dashboard"}>Dashboard</Link>,
    },
    {
      key: "account-details",
      icon: <CircleUser size={21} strokeWidth={2} />,
      label: <Link href={"/admin/account-details"}>Account Details</Link>,
    },
    {
      key: "earnings",
      icon: <CircleDollarSign size={21} strokeWidth={2} />,
      label: <Link href={"/admin/earnings"}>Earnings</Link>,
    },
    {
      key: "manage-subscription",
      icon: <Podcast size={21} strokeWidth={2} />,
      label: (
        <Link href={"/admin/manage-subscription"}>Manage Subscriptions</Link>
      ),
    },
    {
      key: "category",
      icon: <Shapes size={21} strokeWidth={2} />,
      label: <Link href={"/admin/category"}>Category</Link>,
    },
    {
      key: "subcategory",
      icon: <Shapes size={21} strokeWidth={2} />,
      label: <Link href={"/admin/subcategory"}>Subcategory</Link>,
    },
    {
      key: "settings",
      icon: <SlidersVertical size={21} strokeWidth={2} />,
      label: "Settings",
      children: [
        {
          key: "privacy-policy",
          icon: <ScrollText size={21} strokeWidth={2} />,
          label: <Link href="/admin/privacy-policy">Privacy Policy</Link>,
        },
        {
          key: "terms-conditions",
          icon: <ScrollText size={21} strokeWidth={2} />,
          label: <Link href="/admin/terms-conditions">Terms & Conditions</Link>,
        },
        {
          key: "about-us",
          icon: <ScrollText size={21} strokeWidth={2} />,
          label: <Link href="/admin/about-us">About Us</Link>,
        },
      ],
    },
    {
      key: "logout",
      icon: <LogOut size={21} strokeWidth={2} />,
      label: <Link href="/login">Logout</Link>,
    },
  ];

  // Get current path for sidebar menu item `key`
  const currentPathname = usePathname()?.replace("/admin/", "")?.split(" ")[0];

  return (
    <Sider
      width={320}
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        paddingInline: `${!collapsed ? "10px" : "4px"}`,
        paddingBlock: "30px",
        backgroundColor: "var(--demin-primary-100)",
        maxHeight: "100vh",
        overflow: "auto",
      }}
      className="scroll-hide"
    >
      <div className="flex flex-col items-center justify-center mb-6 gap-y-5">
        <Link href={"/"}>
          {collapsed ? (
            // Logo small
            <svg
              width="40"
              height="40"
              viewBox="0 0 90 75"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M74.6499 54.63C72.5599 55.15 70.6499 55.1 68.7699 55.1C59.4699 55.14 50.1699 55.13 40.8799 55.14C40.3199 55.14 39.7499 55.17 39.1799 55.14C38.2099 55.08 37.9399 55.58 37.9499 56.46C37.9799 58.73 37.9499 61 37.9499 63.26C37.9499 66.58 37.9099 69.9 37.9699 73.21C37.9999 74.4 37.5399 74.75 36.4099 74.73C32.3399 74.65 33.0899 75.12 32.9799 71.45C32.9299 69.76 33.1899 68.05 32.7999 66.38C32.1899 63.1 32.4699 59.75 31.9899 56.47V56.45C32.2399 56.45 32.4799 56.45 32.7199 56.45C32.8499 51.71 32.8499 46.96 32.7199 42.23H31.9799V42.21C31.8999 39.16 31.8999 36.11 31.9799 33.05H32.7199C32.8999 28.82 32.8799 24.58 32.7999 20.34C32.5899 20.34 32.3799 20.34 32.1699 20.34C32.6399 18.03 32.4199 15.69 32.4599 13.37C32.4699 12.4 32.4599 11.45 32.7999 10.52C33.2399 7.87001 32.8999 5.19 32.9899 2.54C33.0599 0.539996 33.0399 0.509998 35.0099 0.509998C38.3999 0.509998 37.9299 0.230007 37.9599 3.52001C37.9699 4.97001 37.9599 6.43 37.9599 7.89C37.9699 10.83 37.7899 10.55 40.5299 10.55C44.2499 10.55 47.9699 10.58 51.6899 10.53C52.7999 10.52 53.4099 10.84 53.8399 11.95C57.8199 22.02 61.8599 32.06 65.8899 42.12C65.9699 42.33 66.1199 42.56 65.6899 43.09C62.5199 43.09 59.0699 43.09 55.6399 43.09C54.4899 43.09 54.4399 42.13 54.1799 41.44C52.6399 37.36 51.1499 33.26 49.6299 29.17C48.8099 26.97 47.9899 24.78 46.9599 22.04C43.8799 29.97 40.9899 37.43 38.0999 44.89C39.1799 45.34 40.0699 45.17 40.9399 45.17C50.2399 45.2 59.5399 45.24 68.8299 45.21C70.3099 45.21 71.1699 45.53 71.6699 47.08C72.4899 49.6 73.5999 52.02 74.6599 54.66L74.6499 54.63Z"
                fill="#1B70A6"
              />
              <path
                d="M32.7201 56.44C32.9701 59.75 33.2301 63.06 32.8001 66.38C27.5501 66.38 22.2901 66.42 17.0401 66.33C12.7101 66.26 8.75008 65.03 5.52008 62C-1.93992 54.97 0.0800819 42.54 9.38008 38.28C9.89008 38.05 10.4201 37.84 10.9301 37.62C10.9901 36.97 10.4501 36.84 10.0801 36.6C1.98008 31.25 3.38008 18.63 10.2201 13.82C13.2301 11.7 16.5201 10.57 20.1801 10.54C24.3901 10.51 28.5801 10.51 32.7901 10.51C33.1301 13.78 33.1301 17.06 32.7901 20.33C32.5801 20.33 32.3701 20.33 32.1601 20.33C28.9101 20.31 25.6701 20.28 22.4201 20.28C20.2601 20.28 18.5301 21.22 17.2301 22.9C15.6901 24.89 15.2301 27.14 16.2801 29.47C17.2901 31.71 19.1801 32.94 21.6201 33.01C25.0701 33.11 28.5201 33.05 31.9701 33.04H32.7101C32.9101 36.1 32.9101 39.16 32.7101 42.22H31.9701C27.9501 42.23 23.9201 42.36 19.9001 42.16C15.6201 41.94 12.4401 45.94 12.4001 49.7C12.3601 53.54 15.4101 56.43 19.6701 56.49C23.7701 56.55 27.8801 56.48 31.9901 56.46C32.2401 56.46 32.4801 56.46 32.7201 56.46V56.44Z"
                fill="#64B445"
              />
              <path
                d="M73.2 45.21C76.41 45.21 79.14 45.22 81.88 45.21C82.59 45.21 83.1 45.38 83.37 46.12C84.42 48.97 85.5 51.81 86.69 54.97C83.59 54.97 80.79 54.97 77.99 54.97C77.35 54.97 76.98 54.66 76.74 54.06C75.63 51.24 74.49 48.43 73.2 45.22V45.21Z"
                fill="#64B445"
              />
              <path
                d="M89.3199 44C88.6899 44.08 88.4599 44.12 88.2199 44.13C85.1333 44.2033 83.1166 42.6367 82.1699 39.43C83.7299 39.07 85.2899 39.28 86.8299 39.29C87.3099 39.29 87.4999 39.67 87.6599 40.05C88.1799 41.3 88.7099 42.55 89.3199 44.01V44Z"
                fill="#64B445"
              />
              <path
                d="M79.63 40.62C75.96 41.16 75.95 41.15 75.05 37.68C78.99 36.82 78.88 37.49 79.63 40.62Z"
                fill="#64B445"
              />
            </svg>
          ) : (
            <Image
              src={logo}
              alt="Logo Of Before After Story"
              className="w-auto h-16"
            />
          )}
        </Link>
      </div>

      <Menu
        onClick={onClick}
        defaultSelectedKeys={[currentPathname]}
        mode="inline"
        className="sidebar-menu space-y-2.5 !border-none !bg-transparent"
        items={navLinks}
      />
    </Sider>
  );
};

export default SidebarContainer;
