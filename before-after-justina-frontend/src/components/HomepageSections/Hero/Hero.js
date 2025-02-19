"use client";

import "./Hero.css";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import NonAuthHero from "./NonAuthHero";
import CustomerHero from "./CustomerHero";
import ServiceProviderHero from "./ServiceProviderHero";

export default function Hero() {
  // Check if user exists and show content based on user role
  const user = useSelector(selectUser);

  return (
    <div className="hero-bg flex-center h-[75vh] w-full md:h-[85vh] lg:h-screen">
      {!user ? (
        <NonAuthHero />
      ) : user?.role === "user" ? (
        <CustomerHero />
      ) : (
        <ServiceProviderHero />
      )}
    </div>
  );
}
