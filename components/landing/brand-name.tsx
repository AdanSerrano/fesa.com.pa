import { memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandNameSize = "sm" | "md" | "lg";

const sizeClasses: Record<BrandNameSize, string> = {
  sm: "h-5 w-auto",
  md: "h-6 w-auto",
  lg: "h-7 w-auto",
};

function BrandNameComponent({
  size = "lg",
  className,
}: {
  size?: BrandNameSize;
  className?: string;
}) {
  return (
    <Image
      src="/FESALOGO.png"
      alt="FESA"
      width={200}
      height={70}
      className={cn(sizeClasses[size], "dark:invert", className)}
      priority
    />
  );
}

export const BrandName = memo(BrandNameComponent);
BrandName.displayName = "BrandName";
