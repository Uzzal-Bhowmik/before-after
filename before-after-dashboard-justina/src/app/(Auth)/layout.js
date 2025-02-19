import { LogoSvg } from "@/assets/logos/LogoSvg";
import React from "react";

export default function AuthLayout({ children }) {
  return (
    <main className="h-screen flex-center w-full bg-gradient-to-br from-primary-green/35 to-primary-blue/50">
      <div className="lg:w-1/3 2xl:w-[25%] mx-auto">
        <div className="w-max mx-auto mb-3">
          <LogoSvg />
        </div>

        <div className="bg-white w-full">{children}</div>
      </div>
    </main>
  );
}
