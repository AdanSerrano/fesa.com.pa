"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function LocaleSwitcherSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-md" />;
}

export const LocaleSwitcherDynamic = dynamic(
  () => import("@/components/locale-switcher").then((mod) => mod.LocaleSwitcher),
  {
    ssr: false,
    loading: ({ isLoading }) => {
      if (isLoading) return <LocaleSwitcherSkeleton />;
      return null;
    },
  }
);
