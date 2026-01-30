"use client";

import { memo, useMemo } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();

  const isActive = useMemo(() => {
    return (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    };
  }, [pathname]);

  return (
    <nav className="hidden items-center gap-6 lg:flex">
      {navLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm transition-colors hover:text-foreground",
              active
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
      {showDashboard && (
        <Link
          href="/dashboard/overview"
          className={cn(
            "text-sm transition-colors hover:text-foreground",
            isActive("/dashboard")
              ? "font-semibold text-foreground"
              : "text-muted-foreground"
          )}
        >
          {dashboardLabel}
        </Link>
      )}
    </nav>
  );
}

export const HeaderNav = memo(HeaderNavComponent);
HeaderNav.displayName = "HeaderNav";
