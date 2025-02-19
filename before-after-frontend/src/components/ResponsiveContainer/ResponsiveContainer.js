"use client";

import { cn } from "@/lib/utils";
import React from "react";

export default function ResponsiveContainer({ children, classes, id }) {
  return (
    <section
      className={cn(
        `mx-auto w-full px-5 md:px-10 lg:w-[90%] lg:px-0 2xl:w-[85%] 3xl:w-[80%]`,
        classes,
      )}
      id={id}
    >
      {children}
    </section>
  );
}
