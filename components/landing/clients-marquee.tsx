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
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex animate-scroll-x gap-8 pr-8">
          {industries.map((industry) => (
            <div
              key={industry}
              className="flex items-center justify-center px-6 py-3 rounded-full bg-muted/50 border whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              {industry}
            </div>
          ))}
        </div>
        <div className="flex animate-scroll-x gap-8 pr-8" aria-hidden="true">
          {industries.map((industry) => (
            <div
              key={`${industry}-duplicate`}
              className="flex items-center justify-center px-6 py-3 rounded-full bg-muted/50 border whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
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
