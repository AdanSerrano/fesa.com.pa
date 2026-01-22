"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  MailWarning,
  Trash2,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import type { AdminUsersStats } from "../../types/admin-users.types";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const StatsCard = memo(function StatsCard({
  title,
  value,
  description,
  icon,
  variant = "default",
}: StatsCardProps) {
  const variantClasses = {
    default: "text-muted-foreground",
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={variantClasses[variant]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
});

interface AdminUsersStatsProps {
  stats: AdminUsersStats | null;
}

export const AdminUsersStatsSection = memo(function AdminUsersStatsSection({
  stats,
}: AdminUsersStatsProps) {
  if (!stats) return null;

  const cards = [
    {
      title: "Total Usuarios",
      value: stats.total,
      description: "Usuarios registrados",
      icon: <Users className="h-4 w-4" />,
      variant: "default" as const,
    },
    {
      title: "Activos",
      value: stats.active,
      description: "Usuarios activos",
      icon: <UserCheck className="h-4 w-4" />,
      variant: "success" as const,
    },
    {
      title: "Bloqueados",
      value: stats.blocked,
      description: "Usuarios bloqueados",
      icon: <UserX className="h-4 w-4" />,
      variant: "warning" as const,
    },
    {
      title: "Administradores",
      value: stats.admins,
      description: "Usuarios admin",
      icon: <ShieldCheck className="h-4 w-4" />,
      variant: "default" as const,
    },
    {
      title: "Sin Verificar",
      value: stats.unverified,
      description: "Email no verificado",
      icon: <MailWarning className="h-4 w-4" />,
      variant: "warning" as const,
    },
    {
      title: "Eliminados",
      value: stats.deleted,
      description: "Usuarios eliminados",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "danger" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => (
        <AnimatedSection key={card.title} animation="fade-up" delay={index * 50}>
          <StatsCard {...card} />
        </AnimatedSection>
      ))}
    </div>
  );
});
