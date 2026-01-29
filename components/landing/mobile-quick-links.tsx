"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Briefcase, Package, BookOpen, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MobileQuickLinksProps {
  links: {
    icon: string;
    label: string;
    href: string;
  }[];
}

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  package: Package,
  bookOpen: BookOpen,
  newspaper: Newspaper,
};

function MobileQuickLinksComponent({ links }: MobileQuickLinksProps) {
  return (
    <div className="lg:hidden mt-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {links.map((link) => {
          const Icon = iconMap[link.icon] || Briefcase;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-full border bg-card/80 backdrop-blur-sm text-sm font-medium transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 active:scale-95"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span>{link.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const MobileQuickLinks = memo(MobileQuickLinksComponent);
MobileQuickLinks.displayName = "MobileQuickLinks";
