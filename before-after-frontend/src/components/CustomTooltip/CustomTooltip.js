import React from "react";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function CustomTooltip({ children, title }) {
  return (
    <TooltipProvider delayDuration={0.2}>
      <Tooltip>
        <TooltipTrigger as="div">{children}</TooltipTrigger>
        <TooltipContent className="font-dm-sans">{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
