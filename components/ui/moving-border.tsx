import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MovingBorderProps {
  children: ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
}

export function MovingBorder({
  children,
  duration = 3,
  className,
  containerClassName,
}: MovingBorderProps) {
  return (
    <div className={cn("moving-border-wrapper", containerClassName)}>
      <div
        className="moving-border-gradient"
        style={{ animationDuration: `${duration}s` }}
      />
      <div
        className={cn(
          "relative z-10 rounded-xl bg-primary",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
