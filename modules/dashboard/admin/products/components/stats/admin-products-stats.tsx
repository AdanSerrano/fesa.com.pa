"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Package, CheckCircle, Star, ShoppingCart } from "lucide-react";
import type { AdminProductsStats } from "../../types/admin-products.types";

interface StatsLabels {
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
}

interface AdminProductsStatsSectionProps {
  stats: AdminProductsStats | null;
  labels: StatsLabels;
}

const StatCard = memo(function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
});

export const AdminProductsStatsSection = memo(function AdminProductsStatsSection({
  stats,
  labels,
}: AdminProductsStatsSectionProps) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title={labels.totalCategories}
        value={stats.totalCategories}
        description={labels.totalCategoriesDesc}
        icon={FolderOpen}
      />
      <StatCard
        title={labels.totalItems}
        value={stats.totalItems}
        description={labels.totalItemsDesc}
        icon={Package}
      />
      <StatCard
        title={labels.activeCategories}
        value={stats.activeCategories}
        description={labels.activeCategoriesDesc}
        icon={CheckCircle}
      />
      <StatCard
        title={labels.activeItems}
        value={stats.activeItems}
        description={labels.activeItemsDesc}
        icon={ShoppingCart}
      />
      <StatCard
        title={labels.featuredCategories}
        value={stats.featuredCategories}
        description={labels.featuredCategoriesDesc}
        icon={Star}
      />
    </div>
  );
});
