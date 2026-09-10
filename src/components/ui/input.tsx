import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-border outline-none transition-shadow duration-150 placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/70",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
