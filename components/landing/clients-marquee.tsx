"use client";

import { memo } from "react";

interface ClientsMarqueeProps {
  title: string;
}

const industries = [
  "Banca",
  "Seguros",
  "Manufactura",
  "Retail",
  "Educación",
  "Gobierno",
  "Salud",
  "Telecomunicaciones",
  "Energía",
  "Logística",
  "Construcción",
  "Agroindustria",
];

function ClientsMarqueeComponent({ title }: ClientsMarqueeProps) {
  return (
    <div className="relative overflow-hidden py-6">
      <p className="text-center text-sm text-muted-foreground mb-6">{title}</p>
      <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-scroll-x group-hover:paused gap-8 pr-8">
          {industries.map((industry) => (
            <div
              key={industry}
              className="flex items-center justify-center px-6 py-3 rounded-full bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/30 whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-brand-600 dark:hover:text-brand-300 hover:shadow-md hover:shadow-brand-500/5 transition-all"
            >
              {industry}
            </div>
          ))}
        </div>
        <div className="flex animate-scroll-x group-hover:paused gap-8 pr-8" aria-hidden="true">
          {industries.map((industry) => (
            <div
              key={`${industry}-duplicate`}
              className="flex items-center justify-center px-6 py-3 rounded-full bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/30 whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-brand-600 dark:hover:text-brand-300 hover:shadow-md hover:shadow-brand-500/5 transition-all"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ClientsMarquee = memo(ClientsMarqueeComponent);
ClientsMarquee.displayName = "ClientsMarquee";
