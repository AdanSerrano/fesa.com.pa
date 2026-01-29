"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Star, FileImage } from "lucide-react";
import type { AdminCatalogsStats } from "../../types/admin-catalogs.types";

interface StatsLabels {
  totalCatalogs: string;
  totalCatalogsDesc: string;
  activeCatalogs: string;
  activeCatalogsDesc: string;
  featuredCatalogs: string;
  featuredCatalogsDesc: string;
  totalPages: string;
  totalPagesDesc: string;
}

interface AdminCatalogsStatsSectionProps {
  stats: AdminCatalogsStats | null;
  labels: StatsLabels;
}

const StatCard = memo(function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number | string;
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

export const AdminCatalogsStatsSection = memo(function AdminCatalogsStatsSection({
  stats,
  labels,
}: AdminCatalogsStatsSectionProps) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={labels.totalCatalogs}
        value={stats.total}
        description={labels.totalCatalogsDesc}
        icon={BookOpen}
      />
      <StatCard
        title={labels.activeCatalogs}
        value={stats.active}
        description={labels.activeCatalogsDesc}
        icon={CheckCircle}
      />
      <StatCard
        title={labels.featuredCatalogs}
        value={stats.featured}
        description={labels.featuredCatalogsDesc}
        icon={Star}
      />
      <StatCard
        title={labels.totalPages}
        value={stats.totalPages}
        description={labels.totalPagesDesc}
        icon={FileImage}
      />
    </div>
  );
});
