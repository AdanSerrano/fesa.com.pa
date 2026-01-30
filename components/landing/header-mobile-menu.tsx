"use client";

import { memo, useMemo } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Settings,
  Shield,
  Menu,
  LayoutDashboard,
  Briefcase,
  Package,
  Newspaper,
  Home,
  Building2,
  BookOpen,
} from "lucide-react";
import { LogoutButton } from "./logout-button";

const iconMap = {
  Briefcase,
  Package,
  Newspaper,
  Home,
  Building2,
  BookOpen,
} as const;

type IconName = keyof typeof iconMap;

interface NavLink {
  href: string;
  label: string;
  iconName: IconName;
}

interface HeaderMobileMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  navLinks: NavLink[];
  labels: {
    dashboard: string;
    myAccount: string;
    settings: string;
    securityAudit: string;
  };
}

function HeaderMobileMenuComponent({ user, navLinks, labels }: HeaderMobileMenuProps) {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    return (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    };
  }, [pathname]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Fesa
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = iconMap[link.iconName];
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-foreground",
                  active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          {user && (
            <Link
              href="/dashboard/overview"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-foreground",
                isActive("/dashboard")
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              {labels.dashboard}
            </Link>
          )}
          <div className="my-2 border-t" />
          {user && (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} alt={user.name || "Usuario"} />
                  <AvatarFallback className="text-xs">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  {user.name && <span className="text-sm font-medium line-clamp-1">{user.name}</span>}
                  {user.email && (
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/dashboard/overview"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <User className="h-4 w-4" />
                {labels.myAccount}
              </Link>
              <Link
                href="/dashboard/settings/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                {labels.settings}
              </Link>
              <Link
                href="/dashboard/settings/security"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Shield className="h-4 w-4" />
                {labels.securityAudit}
              </Link>
            </>
          )}
        </nav>
        {user && (
          <div className="border-t pt-4 px-3 mt-auto">
            <LogoutButton variant="button" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export const HeaderMobileMenu = memo(HeaderMobileMenuComponent);
HeaderMobileMenu.displayName = "HeaderMobileMenu";
