import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-[rgba(0,0,0,0.38)] mt-4 text-base h-12 md:h-14  placeholder:text-[rgba(0,0,0,0.38)] bg-[rgba(0,0,0,0.05)] selection:bg-[rgba(0,0,0,0.38)] selection:text-white font-medium border-input flex h-10 w-full min-w-0 rounded-md border px-4 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
        "focus:bg-[#F0DFFF]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
