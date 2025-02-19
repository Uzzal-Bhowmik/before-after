import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 shadow dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 shadow dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80",
        outline: "text-neutral-950 dark:text-neutral-50",

        info: "bg-[#e6f4ff] text-[#3d7ce2] border-transparent rounded font-medium",

        ongoing:
          "text-[#faede8] bg-[#f7845e] border-transparent rounded font-medium",

        completed:
          "bg-[#056e48] text-white border-transparent rounded font-medium",

        pending:
          "bg-[#0056d2] text-white border-transparent rounded font-medium",
        approved:
          "bg-[#056e48] text-white border-transparent rounded font-medium",
        canceled:
          "bg-[#780606] text-white border-transparent rounded font-medium",
        cancelled:
          "bg-[#780606] text-white border-transparent rounded font-medium",

        costFree:
          "bg-[#780606] text-white border-transparent rounded font-medium",
        costly:
          "bg-green-500 text-white border-transparent rounded font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
