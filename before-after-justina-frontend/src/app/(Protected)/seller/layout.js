"use client";

import { logout, selectUser } from "@/redux/features/authSlice";
import { ErrorModal } from "@/utils/customModal";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function SellerLayout({ children }) {
  const role = useSelector(selectUser)?.role;
  const dispatch = useDispatch();
  const router = useRouter();

  // Check if pathname is seller/[id]
  // If so, give unauth access as it's a public route
  const currentPathname = usePathname();
  const regexToCheckPathname = /^\/seller\/[a-fA-F0-9]{24}$/;

  // Redirect is user role is not user(customer)
  // useEffect(() => {
  //   if (
  //     role !== "service_provider" &&
  //     regexToCheckPathname.test(currentPathname) === false
  //   ) {
  //     dispatch(logout());
  //     router.refresh();
  //     redirect("/login");
  //   }
  // }, [role]);

  return <div>{children}</div>;
}
