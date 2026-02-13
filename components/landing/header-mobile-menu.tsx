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
  Briefcase,
  Package,
  Newspaper,
  Building2,
  BookOpen,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { LogoutButton } from "./logout-button";
import type { MobileMenuProps, NavGroupLink } from "./header-dynamic";

const iconMap = {
  Briefcase,
  Package,
  Newspaper,
  Building2,
  BookOpen,
  ShieldCheck,
  Mail,
} as const;

type IconName = keyof typeof iconMap;

const MobileNavLink = memo(function MobileNavLink({
  href,
  label,
  iconName,
  isActive,
}: {
  href: string;
  label: string;
  iconName: string;
  isActive: boolean;
}) {
  const Icon = iconMap[iconName as IconName] || Briefcase;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent hover:text-foreground",
        isActive
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
});
MobileNavLink.displayName = "MobileNavLink";

const MobileNavSection = memo(function MobileNavSection({
  title,
  links,
  isActive,
}: {
  title: string;
  links: NavGroupLink[];
  isActive: (href: string) => boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="mx-3 mb-1 border-b pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      </div>
      {links.map((link) => (
        <MobileNavLink
          key={link.href}
          href={link.href}
          label={link.label}
          iconName={link.iconName}
          isActive={isActive(link.href)}
        />
      ))}
    </div>
  );
});
MobileNavSection.displayName = "MobileNavSection";

function HeaderMobileMenuComponent({
  user,
  solutionsGroup,
  companyGroup,
  directLinks,
  labels,
}: MobileMenuProps) {
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
          <SheetTitle className="flex items-center gap-2 text-foreground font-black tracking-tight">
            Fesa
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-4 flex-1 overflow-y-auto">
          <MobileNavSection
            title={solutionsGroup.trigger}
            links={solutionsGroup.links}
            isActive={isActive}
          />

          <div className="mx-3 my-1 border-t" />

          <div className="space-y-1">
            {directLinks.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                iconName={link.iconName}
                isActive={isActive(link.href)}
              />
            ))}
          </div>

          <div className="mx-3 my-1 border-t" />

          <MobileNavSection
            title={companyGroup.trigger}
            links={companyGroup.links}
            isActive={isActive}
          />

          {user && (
            <>
              <div className="mx-3 my-1 border-t" />
              <MobileNavLink
                href="/dashboard/overview"
                label={labels.dashboard}
                iconName="Briefcase"
                isActive={isActive("/dashboard")}
              />
            </>
          )}

          {user && (
            <>
              <div className="mx-3 my-1 border-t" />
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
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
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <User className="h-4 w-4" />
                {labels.myAccount}
              </Link>
              <Link
                href="/dashboard/settings/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                {labels.settings}
              </Link>
              <Link
                href="/dashboard/settings/security"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
