"use client";

import { memo } from "react";

interface TrustedBySectionProps {
  title: string;
}

const companies = [
  "Banesco",
  "Banco Nacional",
  "Copa Airlines",
  "Samsung",
  "Dell",
  "HP",
  "Microsoft",
  "Grupo Rey",
  "Super 99",
  "Cable & Wireless",
  "Digicel",
  "AES Panamá",
];

function TrustedBySectionComponent({ title }: TrustedBySectionProps) {
  return (
    <section className="py-12 sm:py-16 border-b bg-muted/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p className="text-center text-sm text-muted-foreground mb-10 font-medium uppercase tracking-wider">
          {title}
        </p>
      </div>
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex animate-scroll-x-slow gap-12 pr-12">
          {companies.map((company) => (
            <div
              key={company}
              className="flex items-center justify-center px-8 py-4 rounded-xl bg-card border shadow-sm whitespace-nowrap text-base font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-md transition-all"
            >
              {company}
            </div>
          ))}
        </div>
        <div className="flex animate-scroll-x-slow gap-12 pr-12" aria-hidden="true">
          {companies.map((company) => (
            <div
              key={`${company}-duplicate`}
              className="flex items-center justify-center px-8 py-4 rounded-xl bg-card border shadow-sm whitespace-nowrap text-base font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-md transition-all"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const TrustedBySection = memo(TrustedBySectionComponent);
TrustedBySection.displayName = "TrustedBySection";
