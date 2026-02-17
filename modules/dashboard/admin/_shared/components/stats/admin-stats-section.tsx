"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BaseStats } from "../../types/admin-shared.types";

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

export type { StatCardProps };

export interface StatConfig {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

interface AdminStatsSectionProps {
  stats: BaseStats | null;
  statConfigs: StatConfig[];
}

export const AdminStatsSection = memo(function AdminStatsSection({
  stats,
  statConfigs,
}: AdminStatsSectionProps) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {statConfigs.map((config, index) => (
        <StatCard
          key={index}
          title={config.title}
          value={config.value}
          description={config.description}
          icon={config.icon}
          variant={config.variant}
        />
      ))}
    </div>
  );
});
