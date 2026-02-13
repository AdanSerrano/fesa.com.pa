"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

type IconName = "Briefcase" | "Package" | "Newspaper" | "Home" | "Building2" | "BookOpen" | "ShieldCheck" | "Mail";

export interface NavGroupLink {
  href: string;
  label: string;
  description: string;
  iconName: IconName;
}

export interface NavGroup {
  trigger: string;
  description: string;
  links: NavGroupLink[];
}

export interface DirectLink {
  href: string;
  label: string;
  description: string;
  iconName: IconName;
}

export interface HeaderNavProps {
  solutionsGroup: NavGroup;
  companyGroup: NavGroup;
  directLinks: DirectLink[];
  showDashboard: boolean;
  dashboardLabel: string;
}

export interface MobileMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  solutionsGroup: NavGroup;
  companyGroup: NavGroup;
  directLinks: DirectLink[];
  labels: {
    dashboard: string;
    myAccount: string;
    settings: string;
    securityAudit: string;
  };
}

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  labels: {
    myAccount: string;
    settings: string;
    securityAudit: string;
  };
}

function MobileMenuSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-md lg:hidden" />;
}

function UserMenuSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-full hidden lg:block" />;
}

export const HeaderMobileMenuDynamic = dynamic<MobileMenuProps>(
  () => import("./header-mobile-menu").then((mod) => mod.HeaderMobileMenu),
  {
    ssr: false,
    loading: () => <MobileMenuSkeleton />,
  }
);

export const HeaderUserMenuDynamic = dynamic<UserMenuProps>(
  () => import("./header-user-menu").then((mod) => mod.HeaderUserMenu),
  {
    ssr: false,
    loading: () => <UserMenuSkeleton />,
  }
);

function NavSkeleton() {
  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-md" />
      ))}
    </nav>
  );
}

export const HeaderNavDynamic = dynamic<HeaderNavProps>(
  () => import("./header-nav").then((mod) => mod.HeaderNav),
  {
    ssr: false,
    loading: () => <NavSkeleton />,
  }
);

function LogoSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

export const HeaderLogoDynamic = dynamic(
  () => import("./header-logo").then((mod) => mod.HeaderLogo),
  {
    ssr: false,
    loading: () => <LogoSkeleton />,
  }
);

