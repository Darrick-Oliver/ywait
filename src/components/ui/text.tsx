import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface TextProps extends PropsWithChildren {
  type?: "h1" | "h2" | "h3" | "h4" | "p";
  className?: string;
}

export function Text({ type = "p", className, children }: TextProps) {
  return type === "h1" ? (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  ) : type === "h2" ? (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  ) : type === "h3" ? (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  ) : type === "h4" ? (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  ) : (
    <p className={cn("leading-7 text-sm", className)}>{children}</p>
  );
}
