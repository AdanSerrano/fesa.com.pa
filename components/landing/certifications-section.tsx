"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Award, Shield, Leaf, Cog } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CertificationsSectionProps {
  labels: {
    badge: string;
    title: string;
    subtitle: string;
  };
  certifications: {
    icon: string;
    name: string;
    description: string;
  }[];
}

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  shield: Shield,
  leaf: Leaf,
  cog: Cog,
};

const CertificationCard = memo(function CertificationCard({
  certification,
  index,
}: {
  certification: {
    icon: string;
    name: string;
    description: string;
  };
  index: number;
}) {
  const Icon = iconMap[certification.icon] || Award;
  const colors = [
    { bg: "bg-brand-100/70 dark:bg-brand-400/10", text: "text-brand-600 dark:text-brand-400", border: "border-brand-200/50 dark:border-brand-400/20", accent: "from-brand-500 to-brand-600" },
    { bg: "bg-brand-100/50 dark:bg-brand-300/10", text: "text-brand-700 dark:text-brand-300", border: "border-brand-200/40 dark:border-brand-300/20", accent: "from-brand-600 to-brand-700" },
    { bg: "bg-brand-100/60 dark:bg-brand-400/10", text: "text-brand-800 dark:text-brand-400", border: "border-brand-300/40 dark:border-brand-400/20", accent: "from-brand-700 to-brand-800" },
    { bg: "bg-brand-100/40 dark:bg-brand-300/10", text: "text-brand-900 dark:text-brand-300", border: "border-brand-200/30 dark:border-brand-300/20", accent: "from-brand-800 to-brand-900" },
  ];
  const color = colors[index % colors.length];

  return (
    <AnimatedSection animation="fade-up" delay={index * 100}>
      <Card className={`h-full border-2 ${color.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-400/50 group overflow-hidden relative card-glow-hover`}>
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        <CardContent className="p-6 text-center">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${color.bg} ${color.text} mb-4 transition-transform group-hover:scale-110`}>
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-lg mb-2">{certification.name}</h3>
          <p className="text-sm text-muted-foreground">{certification.description}</p>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
});

function CertificationsSectionComponent({ labels, certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 border-b bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AnimatedSection animation="fade-up" delay={0}>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Award className="mr-2 h-3.5 w-3.5" />
              {labels.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {labels.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {labels.subtitle}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent to-brand-400" />
              <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-brand-400 to-brand-500 animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, #60a5fa, #93c5fd, #60a5fa)", backgroundSize: "200% auto" }} />
              <div className="h-0.5 w-12 rounded-full bg-gradient-to-l from-transparent to-brand-400" />
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <CertificationCard key={cert.name} certification={cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export const CertificationsSection = memo(CertificationsSectionComponent);
CertificationsSection.displayName = "CertificationsSection";
