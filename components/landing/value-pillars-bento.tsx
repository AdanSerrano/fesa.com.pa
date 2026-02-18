"use client";

import { memo } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Zap, ShieldCheck, TrendingUp, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  shieldCheck: ShieldCheck,
  trendingUp: TrendingUp,
  target: Target,
};

interface Pillar {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface ValuePillarsBentoProps {
  pillars: Pillar[];
}

const PillarHeader = memo(function PillarHeader({
  color,
  iconName,
}: {
  color: string;
  iconName: string;
}) {
  const Icon = iconMap[iconName] ?? Zap;
  return (
    <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-muted/50 to-muted p-6 min-h-[120px]">
      <div
        className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform group-hover/bento:scale-110`}
      >
        <Icon className="h-8 w-8" />
      </div>
    </div>
  );
});
PillarHeader.displayName = "PillarHeader";

function ValuePillarsBentoComponent({ pillars }: ValuePillarsBentoProps) {
  return (
    <BentoGrid className="lg:grid-cols-4">
      {pillars.map((item) => (
        <BentoGridItem
          key={item.title}
          title={item.title}
          description={item.description}
          header={<PillarHeader color={item.color} iconName={item.icon} />}
        />
      ))}
    </BentoGrid>
  );
}

export const ValuePillarsBento = memo(ValuePillarsBentoComponent);
ValuePillarsBento.displayName = "ValuePillarsBento";
