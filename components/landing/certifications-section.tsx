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
    { bg: "bg-blue-500/10 dark:bg-blue-400/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20 dark:border-blue-400/20" },
    { bg: "bg-green-500/10 dark:bg-green-400/10", text: "text-green-600 dark:text-green-400", border: "border-green-500/20 dark:border-green-400/20" },
    { bg: "bg-purple-500/10 dark:bg-purple-400/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20 dark:border-purple-400/20" },
    { bg: "bg-orange-500/10 dark:bg-orange-400/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/20 dark:border-orange-400/20" },
  ];
  const color = colors[index % colors.length];

  return (
    <AnimatedSection animation="fade-up" delay={index * 100}>
      <Card className={`h-full border-2 ${color.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}>
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
    <section className="py-20 sm:py-28 border-b">
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
