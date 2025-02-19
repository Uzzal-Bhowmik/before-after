import { ChevronRight } from "lucide-react";
import React from "react";

export default function AnimatedArrow({ size = 20 }) {
  return (
    <div className="relative overflow-hidden">
      <ChevronRight
        className="ease-in-out-circ transition-all duration-500 group-hover:translate-x-5"
        style={{
          height: size,
          width: size,
        }}
      />
      <ChevronRight
        className="ease-in-out-circ absolute top-0 -translate-x-5 transition-all duration-500 group-hover:translate-x-0"
        style={{
          height: size,
          width: size,
        }}
      />
    </div>
  );
}
