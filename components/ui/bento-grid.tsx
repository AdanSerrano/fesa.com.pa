import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BentoGridProps {
  className?: string;
  children: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoGridItemProps {
  className?: string;
  title: string;
  description: string;
  header?: ReactNode;
  icon?: ReactNode;
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 dark:border-white/[0.1] dark:bg-black dark:shadow-none",
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-1">
        {icon}
        <div className="mt-2 mb-2 font-bold text-lg text-foreground">
          {title}
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}
