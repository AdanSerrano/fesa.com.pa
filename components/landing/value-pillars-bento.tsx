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

const bentoSpans = [
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
];

const PillarHeader = memo(function PillarHeader({
  color,
  iconName,
  isWide,
}: {
  color: string;
  iconName: string;
  isWide: boolean;
}) {
  const Icon = iconMap[iconName] ?? Zap;
  return (
    <div className={`relative flex items-center justify-center rounded-xl overflow-hidden ${isWide ? "p-8 min-h-[140px]" : "p-6 min-h-[120px]"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-muted/50 to-muted/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
      <div
        className={`relative inline-flex ${isWide ? "h-20 w-20" : "h-16 w-16"} items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform group-hover/bento:scale-110`}
      >
        <Icon className={isWide ? "h-10 w-10" : "h-8 w-8"} />
      </div>
    </div>
  );
});
PillarHeader.displayName = "PillarHeader";

function ValuePillarsBentoComponent({ pillars }: ValuePillarsBentoProps) {
  return (
    <BentoGrid className="lg:grid-cols-3">
      {pillars.map((item, index) => (
        <BentoGridItem
          key={item.title}
          className={bentoSpans[index % bentoSpans.length]}
          title={item.title}
          description={item.description}
          header={
            <PillarHeader
              color={item.color}
              iconName={item.icon}
              isWide={index === 0 || index === 3}
            />
          }
        />
      ))}
    </BentoGrid>
  );
}

export const ValuePillarsBento = memo(ValuePillarsBentoComponent);
ValuePillarsBento.displayName = "ValuePillarsBento";
