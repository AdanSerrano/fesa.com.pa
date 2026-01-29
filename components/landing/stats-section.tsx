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
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: TrendingUp,
      value: 25,
      suffix: "%",
      label: labels.stat2Label,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Shield,
      value: 99.9,
      suffix: "%",
      label: labels.stat3Label,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      decimals: 1,
    },
    {
      icon: Building2,
      value: 1000,
      suffix: "+",
      label: labels.stat4Label,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {labels.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {labels.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-card rounded-2xl border p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color} mb-4 transition-transform group-hover:scale-110`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className={`text-4xl sm:text-5xl font-black ${stat.color} mb-2`}>
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">
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
