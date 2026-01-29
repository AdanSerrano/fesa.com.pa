"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface HeaderNavProps {
  navLinks: NavLink[];
  showDashboard: boolean;
  dashboardLabel: string;
}

function HeaderNavComponent({ navLinks, showDashboard, dashboardLabel }: HeaderNavProps) {
  return (
    <nav className="hidden items-center gap-6 lg:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
      {showDashboard && (
        <Link
          href="/dashboard/overview"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {dashboardLabel}
        </Link>
      )}
    </nav>
  );
}

export const HeaderNav = memo(HeaderNavComponent);
HeaderNav.displayName = "HeaderNav";
