"use client";

import { memo, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Send,
  MapPin,
  Database,
  IdCard,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  store: Store,
  send: Send,
  mapPin: MapPin,
  database: Database,
  idCard: IdCard,
};

interface EcosystemCardProps {
  icon: string;
  name: string;
  description: string;
  href: string;
  color: string;
  badge: string | null;
  comingSoonLabel: string;
  visitLabel: string;
}

const EcosystemCardComponent = memo(function EcosystemCardInner({
  icon,
  name,
  description,
  href,
  color,
  badge: badgeText,
  comingSoonLabel,
  visitLabel,
}: EcosystemCardProps) {
  const glareRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[icon] ?? Store;
  const isComingSoon = href === "#";

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!glareRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glareRef.current.style.background = `radial-gradient(200px circle at ${x}px ${y}px, rgba(59,130,246,0.12), transparent 70%)`;
    glareRef.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!glareRef.current) return;
    glareRef.current.style.opacity = "0";
  }, []);

  return (
    <a
      href={isComingSoon ? undefined : href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`group block h-full ${isComingSoon ? "opacity-60 grayscale pointer-events-none" : ""}`}
      onMouseMove={isComingSoon ? undefined : handleMouseMove}
      onMouseLeave={isComingSoon ? undefined : handleMouseLeave}
    >
      <Card
        className={`h-full transition-all duration-300 overflow-hidden relative ${
          isComingSoon
            ? ""
            : "hover:shadow-xl hover:-translate-y-2 hover:border-brand-600/30 card-glow-hover"
        }`}
      >
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
        />
        <CardContent className="p-6 text-center relative">
          {badgeText && (
            <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
              {badgeText}
            </Badge>
          )}
          {isComingSoon && !badgeText && (
            <Badge variant="outline" className="absolute top-3 right-3 text-xs">
              {comingSoonLabel}
            </Badge>
          )}
          <div
            className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg`}
          >
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-lg mb-2 group-hover:text-brand-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          {href.startsWith("http") && (
            <div className="mt-4 flex items-center justify-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-3 w-3 mr-1" />
              {visitLabel}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
});

EcosystemCardComponent.displayName = "EcosystemCard";

export const EcosystemCard = EcosystemCardComponent;
