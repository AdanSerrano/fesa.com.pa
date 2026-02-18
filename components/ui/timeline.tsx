"use client";

import { memo, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Building2, CreditCard, Globe, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  creditCard: CreditCard,
  globe: Globe,
};

const accentColors = [
  "border-l-brand-500",
  "border-l-brand-600",
  "border-l-brand-700",
  "border-l-brand-800",
];

interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  milestones: TimelineMilestone[];
  className?: string;
}

const TimelineItemComponent = memo(function TimelineItemInner({
  milestone,
  index,
}: {
  milestone: TimelineMilestone;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, amount: 0.4 });
  const isEven = index % 2 === 0;
  const Icon = milestone.icon ? iconMap[milestone.icon] : null;
  const accentColor = accentColors[index % accentColors.length];

  return (
    <div
      ref={itemRef}
      className={cn(
        "relative flex items-center gap-4 md:gap-8",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <motion.div
        className={cn(
          "flex-1 rounded-2xl border border-l-4 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md",
          accentColor,
          isEven ? "md:text-right" : "md:text-left",
          "text-left"
        )}
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h3 className="text-lg font-bold text-foreground">{milestone.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{milestone.description}</p>
      </motion.div>

      <motion.div
        className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-500 bg-background shadow-md"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {Icon ? (
          <Icon className="h-6 w-6 text-brand-600" />
        ) : (
          <span className="font-bold text-brand-600 text-xs">{milestone.year}</span>
        )}
      </motion.div>

      <div className="hidden flex-1 md:block" />
    </div>
  );
});
TimelineItemComponent.displayName = "TimelineItem";

function TimelineComponent({ milestones, className }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const beamScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="absolute left-6 md:left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" />

      <motion.div
        className="absolute left-6 md:left-1/2 top-0 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-brand-500 via-brand-400 to-brand-300"
        style={{ scaleY: beamScaleY, height: "100%" }}
      />

      <div className="relative space-y-12 pl-16 md:pl-0">
        {milestones.map((milestone, index) => (
          <TimelineItemComponent
            key={milestone.year}
            milestone={milestone}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

TimelineComponent.displayName = "Timeline";

export const Timeline = memo(TimelineComponent);
