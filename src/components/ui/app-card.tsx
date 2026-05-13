import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "muted";
}

const AppCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000]",
      interactive:
        "border-4 border-black bg-white shadow-[6px_6px_0px_0px_#000] transition-all duration-100 ease-linear hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]",
      muted: "border-4 border-black bg-[#FFFDF5] shadow-[6px_6px_0px_0px_#000]",
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], "p-6", className)}
        {...props}
      />
    );
  }
);

AppCard.displayName = "AppCard";

export { AppCard };
