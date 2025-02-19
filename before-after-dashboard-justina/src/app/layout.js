import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "../lib/Providers";

const generalSans = localFont({
  src: "../assets/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "100 900",
  display: "swap",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata = {
  title: {
    default: "Before After Story - Discover Real Transformations",
    template: "%s | Before After Story",
  },
  description:
    "Before After is a platform that helps people discover real transformation with verified results. Our MoTo - Explore authentic stories of change from trusted businesses. Explore authentic stories of change from trusted businesses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${generalSans.className} ${dmSans.variable} box-border antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
