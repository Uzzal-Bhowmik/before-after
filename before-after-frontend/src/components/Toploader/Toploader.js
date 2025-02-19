"use client";

import HolyLoader from "holy-loader";

export default function Toploader() {
  return (
    <HolyLoader
      color="linear-gradient(to right, #65b545, #1b71a7)"
      height="3px"
      speed={120}
      easing="linear"
      showSpinner={true}
      zIndex={1600}
      initialPosition={0.04}
    />
  );
}
