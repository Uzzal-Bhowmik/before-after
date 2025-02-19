"use client";

import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import Toploader from "@/components/Toploader/Toploader";
import { persistor, store } from "@/redux/store";
import { usePathname } from "next/navigation";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTopBtn from "@/components/ScrollToTopBtn/ScrollToTopBtn";
import { SocketProvider } from "@/context/SocketContextApi";
import { cn } from "./utils";
import { useMediaQuery } from "usehooks-ts";

export default function Providers({ children }) {
  const pathName = usePathname();

  // Declare paths that don't need margin top
  const pathWithoutMargin = ["/", "/services", "/success-stories", "/experts"];

  const isSmallAndMediumDevice = useMediaQuery("(max-width: 1020px)");

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <main className="relative">
            <Navbar
              navBgColor={
                pathWithoutMargin.includes(pathName)
                  ? "bg-white"
                  : "bg-demin-primary-50"
              }
            />

            <div
              style={{
                paddingTop: pathWithoutMargin.includes(pathName)
                  ? 0
                  : isSmallAndMediumDevice
                    ? "100px"
                    : "160px",
                minHeight: "100vh",
              }}
            >
              {children}
            </div>

            <Footer />
          </main>
        </SocketProvider>

        <Toploader />

        <Toaster
          position="bottom-center"
          richColors
          duration={2600}
          closeButton
          toastOptions={{
            style: {
              fontFamily: "var(--font-general-sans)",
              fontWeight: 500,
            },
          }}
        />

        <ScrollToTopBtn />
      </PersistGate>
    </ReduxProvider>
  );
}
