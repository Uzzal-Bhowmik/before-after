import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slottable } from "@radix-ui/react-slot";
import CustomLoader from "../CustomLoader/CustomLoader";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
        destructive:
          "bg-red-600 text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

        // Custom Variants
        "primary-blue":
          "text-white font-semibold shadow-sm bg-primary-blue hover:bg-[#1e87c9] hover:ring-2 hover:ring-primary-green hover:ring-offset-0 transition-all duration-300 ease-in-out ring-offset-primary-green",
        secondary:
          "bg-demin-primary-50 hover:bg-white text-black shadow-sm font-semibold hover:ring-2 hover:ring-2 hover:ring-primary-green hover:ring-offset-0 transition-all duration-300 ease-in-out ring-offset-primary-green",
        success: "bg-[#06924e] text-black shadow-sm font-semibold text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        custom: "h-[45px] rounded-[8px] px-8",
        "custom-md": "h-[36px] rounded-[8px] px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  (
    {
      className,
      loading = false,
      loaderColor,
      loaderSize,
      disabled = false,
      variant,
      children,
      size,
      asChild = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        type={type}
        ref={ref}
        {...props}
        disabled={loading || disabled}
      >
        {loading ? (
          <CustomLoader
            loaderColor={loaderColor}
            size={loaderSize}
            className="mx-auto"
          />
        ) : (
          <Slottable>{children}</Slottable>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
