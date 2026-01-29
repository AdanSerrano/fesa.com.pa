"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

interface LocaleSwitcherProps {
  compact?: boolean;
}

function LocaleSwitcherSkeleton({ compact = false }: LocaleSwitcherProps) {
  return (
    <Skeleton className={`${compact ? "w-[65px]" : "w-[140px]"} h-9 rounded-md`} />
  );
}

export const LocaleSwitcherDynamic = dynamic(
  () => import("@/components/locale-switcher").then((mod) => mod.LocaleSwitcher),
  {
    ssr: false,
    loading: ({ isLoading }) => {
      if (isLoading) return <LocaleSwitcherSkeleton compact />;
      return null;
    },
  }
);
