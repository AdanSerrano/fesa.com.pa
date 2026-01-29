"use client";

import { memo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { CatalogCard } from "./catalog-card";
import type { CatalogsByYear } from "../types/catalogs.types";

interface Labels {
  view: string;
  pages: string;
}

interface CatalogsByYearSectionProps {
  data: CatalogsByYear[];
  labels: Labels;
}

const YearSection = memo(function YearSection({
  year,
  catalogs,
  labels,
  delay,
}: {
  year: number;
  catalogs: CatalogsByYear["catalogs"];
  labels: Labels;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{year}</h2>
          <Badge variant="secondary" className="ml-2">
            {catalogs.length} {catalogs.length === 1 ? "catálogo" : "catálogos"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {catalogs.map((catalog) => (
            <CatalogCard
              key={catalog.id}
              catalog={catalog}
              viewLabel={labels.view}
              pagesLabel={labels.pages}
            />
          ))}
        </div>
      </section>
    </AnimatedSection>
  );
});

function CatalogsByYearSectionComponent({ data, labels }: CatalogsByYearSectionProps) {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {data.map(({ year, catalogs }, index) => (
        <YearSection
          key={year}
          year={year}
          catalogs={catalogs}
          labels={labels}
          delay={index * 100}
        />
      ))}
    </div>
  );
}

export const CatalogsByYearSection = memo(CatalogsByYearSectionComponent);
CatalogsByYearSection.displayName = "CatalogsByYearSection";
