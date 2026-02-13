"use client";

import { memo, useMemo, forwardRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Briefcase,
  Package,
  Newspaper,
  Home,
  Building2,
  BookOpen,
  ShieldCheck,
  Mail,
} from "lucide-react";
import type { HeaderNavProps, NavGroup, NavGroupLink } from "./header-dynamic";

const iconMap = {
  Briefcase,
  Package,
  Newspaper,
  Home,
  Building2,
  BookOpen,
  ShieldCheck,
  Mail,
} as const;

type IconName = keyof typeof iconMap;

interface NavListItemProps {
  href: string;
  label: string;
  description: string;
  iconName: IconName;
  isActive: boolean;
}

const NavListItem = memo(
  forwardRef<HTMLAnchorElement, NavListItemProps>(
    ({ href, label, description, iconName, isActive }, ref) => {
      const Icon = iconMap[iconName];
      return (
        <li>
          <NavigationMenuLink asChild>
            <Link
              ref={ref}
              href={href}
              className={cn(
                "flex items-start gap-3 select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                isActive && "bg-accent/50"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1 pt-0.5">
                <div className={cn("text-sm leading-none", isActive ? "font-semibold" : "font-medium")}>
                  {label}
                </div>
                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {description}
                </p>
              </div>
            </Link>
          </NavigationMenuLink>
        </li>
      );
    }
  )
);
NavListItem.displayName = "NavListItem";

const HighlightCard = memo(function HighlightCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-center rounded-lg bg-muted/50 p-6">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
});
HighlightCard.displayName = "HighlightCard";

const NavItemsList = memo(function NavItemsList({
  links,
  isActive,
}: {
  links: NavGroupLink[];
  isActive: (href: string) => boolean;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {links.map((link) => (
        <NavListItem
          key={link.href}
          href={link.href}
          label={link.label}
          description={link.description}
          iconName={link.iconName as IconName}
          isActive={isActive(link.href)}
        />
      ))}
    </ul>
  );
});
NavItemsList.displayName = "NavItemsList";

const DropdownPanel = memo(function DropdownPanel({
  group,
  isActive,
}: {
  group: NavGroup;
  isActive: (href: string) => boolean;
}) {
  return (
    <div className="grid w-[540px] grid-cols-[.75fr_1fr] gap-4 p-4">
      <HighlightCard title={group.trigger} description={group.description} />
      <NavItemsList links={group.links} isActive={isActive} />
    </div>
  );
});
DropdownPanel.displayName = "DropdownPanel";

function HeaderNavComponent({
  solutionsGroup,
  companyGroup,
  directLinks,
  showDashboard,
  dashboardLabel,
}: HeaderNavProps) {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    return (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    };
  }, [pathname]);

  const isGroupActive = useMemo(() => {
    return (links: NavGroupLink[]) =>
      links.some((link) => isActive(link.href));
  }, [isActive]);

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              isGroupActive(solutionsGroup.links) &&
                "text-foreground font-semibold"
            )}
          >
            {solutionsGroup.trigger}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <DropdownPanel group={solutionsGroup} isActive={isActive} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {directLinks.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link
                href={link.href}
                className={cn(
                  isActive(link.href) && "font-semibold text-foreground"
                )}
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              isGroupActive(companyGroup.links) &&
                "text-foreground font-semibold"
            )}
          >
            {companyGroup.trigger}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <DropdownPanel group={companyGroup} isActive={isActive} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {showDashboard && (
          <NavigationMenuItem>
            <Link
              href="/dashboard/overview"
              className={cn(
                navigationMenuTriggerStyle(),
                isActive("/dashboard") && "font-semibold text-foreground"
              )}
            >
              {dashboardLabel}
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export const HeaderNav = memo(HeaderNavComponent);
HeaderNav.displayName = "HeaderNav";
