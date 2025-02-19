"use client";

import { selectUser } from "@/redux/features/authSlice";
import { ErrorModal } from "@/utils/customModal";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function CustomerLayout({ children }) {
  const role = useSelector(selectUser)?.role;

  // Redirect is user role is not user(customer)
  // useEffect(() => {
  //   if (role !== "user") {
  //     ErrorModal("Unauthorized Access");
  //     redirect("/");
  //   }
  // }, [role]);

  return <div>{children}</div>;
}
