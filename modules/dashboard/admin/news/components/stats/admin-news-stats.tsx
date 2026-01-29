"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Newspaper, Star, FileText } from "lucide-react";
import type { AdminNewsStats } from "../../types/admin-news.types";

interface StatsLabels {
  totalCategories: string;
  totalCategoriesDesc: string;
  totalArticles: string;
  totalArticlesDesc: string;
  publishedArticles: string;
  publishedArticlesDesc: string;
  featuredArticles: string;
  featuredArticlesDesc: string;
}

interface AdminNewsStatsSectionProps {
  stats: AdminNewsStats | null;
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

export const AdminNewsStatsSection = memo(function AdminNewsStatsSection({
  stats,
  labels,
}: AdminNewsStatsSectionProps) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={labels.totalCategories}
        value={stats.totalCategories}
        description={labels.totalCategoriesDesc}
        icon={FolderOpen}
      />
      <StatCard
        title={labels.totalArticles}
        value={stats.totalArticles}
        description={labels.totalArticlesDesc}
        icon={Newspaper}
      />
      <StatCard
        title={labels.publishedArticles}
        value={stats.publishedArticles}
        description={labels.publishedArticlesDesc}
        icon={FileText}
      />
      <StatCard
        title={labels.featuredArticles}
        value={stats.featuredArticles}
        description={labels.featuredArticlesDesc}
        icon={Star}
      />
    </div>
  );
});
