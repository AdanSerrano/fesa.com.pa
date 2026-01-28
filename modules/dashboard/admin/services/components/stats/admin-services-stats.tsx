"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderOpen,
  Layers,
  CheckCircle,
  Star,
} from "lucide-react";
import type { AdminServicesStats } from "../../types/admin-services.types";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

const StatCard = memo(function StatCard({
  title,
  value,
  description,
  icon,
  variant = "default",
}: StatCardProps) {
  const variantClasses = {
    default: "text-muted-foreground",
    success: "text-green-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={variantClasses[variant]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
});

interface AdminServicesStatsSectionProps {
  stats: AdminServicesStats | null;
  labels: {
    totalCategories: string;
    totalCategoriesDesc: string;
    totalItems: string;
    totalItemsDesc: string;
    activeCategories: string;
    activeCategoriesDesc: string;
    activeItems: string;
    activeItemsDesc: string;
    featuredCategories: string;
    featuredCategoriesDesc: string;
  };
}

export const AdminServicesStatsSection = memo(function AdminServicesStatsSection({
  stats,
  labels,
}: AdminServicesStatsSectionProps) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      <StatCard
        title={labels.totalCategories}
        value={stats.totalCategories}
        description={labels.totalCategoriesDesc}
        icon={<FolderOpen className="h-4 w-4" />}
      />
      <StatCard
        title={labels.totalItems}
        value={stats.totalItems}
        description={labels.totalItemsDesc}
        icon={<Layers className="h-4 w-4" />}
      />
      <StatCard
        title={labels.activeCategories}
        value={stats.activeCategories}
        description={labels.activeCategoriesDesc}
        icon={<CheckCircle className="h-4 w-4" />}
        variant="success"
      />
      <StatCard
        title={labels.activeItems}
        value={stats.activeItems}
        description={labels.activeItemsDesc}
        icon={<CheckCircle className="h-4 w-4" />}
        variant="success"
      />
      <StatCard
        title={labels.featuredCategories}
        value={stats.featuredCategories}
        description={labels.featuredCategoriesDesc}
        icon={<Star className="h-4 w-4" />}
        variant="warning"
      />
    </div>
  );
});
