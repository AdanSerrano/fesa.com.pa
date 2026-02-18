"use client";

import { memo, useRef, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import {
  Briefcase,
  Package,
  Newspaper,
  BookOpen,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  package: Package,
  newspaper: Newspaper,
  bookOpen: BookOpen,
};

interface HeroLinkCardProps {
  href: string;
  icon: string;
  label: string;
}

const HeroLinkCardComponent = memo(function HeroLinkCardInner({
  href,
  icon,
  label,
}: HeroLinkCardProps) {
  const Icon = iconMap[icon] ?? Briefcase;
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    glare.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(59,130,246,0.15), transparent 60%)`;
    glare.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    glare.style.opacity = "0";
  }, []);

  return (
    <Link
      ref={cardRef}
      href={href}
      className="group relative flex h-full min-h-[200px] flex-col items-center justify-center gap-4 p-8 rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md transition-[transform,box-shadow] duration-300 will-change-transform hover:shadow-2xl hover:shadow-primary/10"
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 transition-opacity duration-300"
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:ring-primary/40">
        <Icon className="h-7 w-7" />
      </div>
      <span className="text-base font-semibold text-center">{label}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
});

HeroLinkCardComponent.displayName = "HeroLinkCard";

export const HeroLinkCard = HeroLinkCardComponent;
