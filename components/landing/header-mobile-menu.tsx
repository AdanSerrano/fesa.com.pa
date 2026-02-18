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
import { BrandName } from "./brand-name";
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
    <div className="space-y-0.5">
      <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
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
      <SheetContent side="right" className="w-[300px] sm:w-[340px] flex flex-col p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b">
          <SheetTitle>
            <BrandName size="md" />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <MobileNavSection
            title={solutionsGroup.trigger}
            links={solutionsGroup.links}
            isActive={isActive}
          />

          <div className="space-y-0.5">
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

          <MobileNavSection
            title={companyGroup.trigger}
            links={companyGroup.links}
            isActive={isActive}
          />

          {user && (
            <div className="space-y-0.5">
              <MobileNavLink
                href="/dashboard/overview"
                label={labels.dashboard}
                iconName="Briefcase"
                isActive={isActive("/dashboard")}
              />
            </div>
          )}
        </nav>

        {user && (
          <div className="mt-auto border-t bg-muted/30">
            <div className="flex items-center gap-3 px-5 py-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                <AvatarFallback className="text-xs font-medium">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                {user.name && <span className="text-sm font-semibold truncate">{user.name}</span>}
                {user.email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                )}
              </div>
            </div>

            <div className="px-3 pb-1 space-y-0.5">
              <Link
                href="/dashboard/overview"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <User className="h-4 w-4" />
                {labels.myAccount}
              </Link>
              <Link
                href="/dashboard/settings/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                {labels.settings}
              </Link>
              <Link
                href="/dashboard/settings/security"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Shield className="h-4 w-4" />
                {labels.securityAudit}
              </Link>
            </div>

            <div className="px-5 py-3 border-t">
              <LogoutButton variant="button" />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export const HeaderMobileMenu = memo(HeaderMobileMenuComponent);
HeaderMobileMenu.displayName = "HeaderMobileMenu";
