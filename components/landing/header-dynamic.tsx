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

export interface UserMenuProps {
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
