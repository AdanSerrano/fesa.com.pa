"use client";

import { memo } from "react";
import { AnimatedCounter } from "./animated-counter";
import { TrendingUp, Clock, Shield, Building2 } from "lucide-react";

interface StatsSectionProps {
  labels: {
    title: string;
    subtitle: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
    stat4Label: string;
  };
}

function StatsSectionComponent({ labels }: StatsSectionProps) {
  const stats = [
    {
      icon: Clock,
      value: 70,
      suffix: "%",
      label: labels.stat1Label,
    },
    {
      icon: TrendingUp,
      value: 25,
      suffix: "%",
      label: labels.stat2Label,
    },
    {
      icon: Shield,
      value: 99.9,
      suffix: "%",
      label: labels.stat3Label,
      decimals: 1,
    },
    {
      icon: Building2,
      value: 1000,
      suffix: "+",
      label: labels.stat4Label,
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900 text-white section-divider-wave-top section-divider-wave">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-600/15 blur-[100px] animate-glow" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-400/10 blur-[100px] animate-float-delayed" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {labels.title}
          </h2>
          <p className="text-brand-200/70 max-w-2xl mx-auto text-lg">
            {labels.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-400/30 card-glow-hover stat-card-shine"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-brand-300 mb-4 transition-transform group-hover:scale-110">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <p className="text-sm sm:text-base text-brand-200/80 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const StatsSection = memo(StatsSectionComponent);
StatsSection.displayName = "StatsSection";
