import { memo } from "react";
import { cn } from "@/lib/utils";

type BrandNameSize = "sm" | "md" | "lg";

const sizeClasses: Record<BrandNameSize, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

function BrandNameComponent({
  size = "lg",
  className,
}: {
  size?: BrandNameSize;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-black tracking-tight bg-gradient-to-r from-brand-900 to-brand-700 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent",
        sizeClasses[size],
        className
      )}
    >
      Fesa
    </span>
  );
}

export const BrandName = memo(BrandNameComponent);
BrandName.displayName = "BrandName";
