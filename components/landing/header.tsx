import { currentUser } from "@/lib/user";
import { ModeToggle } from "@/components/mode-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { HeaderMobileMenu } from "./header-mobile-menu";
import { HeaderUserMenu } from "./header-user-menu";
import { HeaderNav } from "./header-nav";
import { HeaderLogo } from "./header-logo";
import { AppLauncher } from "./app-launcher";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const user = await currentUser();
  const t = await getTranslations("Header");
  const tNav = await getTranslations("Navigation");

  const solutionsGroup = {
    trigger: tNav("solutions"),
    description: tNav("solutionsDescription"),
    links: [
      {
        href: "/services",
        label: tNav("services"),
        description: tNav("servicesDescription"),
        iconName: "Briefcase" as const,
      },
      {
        href: "/products",
        label: tNav("products"),
        description: tNav("productsDescription"),
        iconName: "Package" as const,
      },
      {
        href: "/catalogs",
        label: tNav("catalogs"),
        description: tNav("catalogsDescription"),
        iconName: "BookOpen" as const,
      },
    ],
  };

  const companyGroup = {
    trigger: tNav("companyLabel"),
    description: tNav("companyDescription"),
    links: [
      {
        href: "/about",
        label: tNav("about"),
        description: tNav("aboutDescription"),
        iconName: "Building2" as const,
      },
      {
        href: "/privacy",
        label: tNav("privacy"),
        description: tNav("privacyDescription"),
        iconName: "ShieldCheck" as const,
      },
    ],
  };

  const directLinks = [
    {
      href: "/news",
      label: tNav("news"),
      description: tNav("newsDescription"),
      iconName: "Newspaper" as const,
    },
    {
      href: "/contact",
      label: tNav("contact"),
      description: tNav("contactDescription"),
      iconName: "Mail" as const,
    },
  ];

  const mobileMenuLabels = {
    dashboard: tNav("dashboard"),
    myAccount: t("myAccount"),
    settings: t("settings"),
    securityAudit: t("securityAudit"),
  };

  const userMenuLabels = {
    myAccount: t("myAccount"),
    settings: t("settings"),
    securityAudit: t("securityAudit"),
  };

  const userData = user
    ? {
        name: user.name,
        email: user.email,
        image: user.image,
      }
    : null;

  const ecosystemApps = [
    {
      name: "Fesa Store",
      description: t("appLauncher.store"),
      href: "https://app.fesastore.com.pa",
      iconName: "store",
      color: "from-brand-500 to-brand-600",
    },
    {
      name: "Fesa Transfer",
      description: t("appLauncher.transfer"),
      href: "https://transfer.fesa.com.pa",
      iconName: "send",
      color: "from-brand-600 to-brand-700",
    },
    {
      name: "Fesa Tracking",
      description: t("appLauncher.tracking"),
      href: "https://tracking.fesa.com.pa",
      iconName: "mapPin",
      color: "from-brand-700 to-brand-800",
    },
    {
      name: "Fesa Storage",
      description: t("appLauncher.storage"),
      href: "https://storage.fesa.com.pa",
      iconName: "database",
      color: "from-brand-800 to-brand-900",
    },
    {
      name: "Fesa ID",
      description: t("appLauncher.id"),
      href: "https://id.fesa.com.pa",
      iconName: "idCard",
      color: "from-brand-400 to-brand-500",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <HeaderLogo />

        <HeaderNav
          solutionsGroup={solutionsGroup}
          companyGroup={companyGroup}
          directLinks={directLinks}
          showDashboard={!!user}
          dashboardLabel={tNav("dashboard")}
        />

        <div className="flex items-center gap-2">
          <AppLauncher apps={ecosystemApps} title={t("appLauncher.title")} />
          <LocaleSwitcher />
          <ModeToggle />

          <HeaderMobileMenu
            user={userData}
            solutionsGroup={solutionsGroup}
            companyGroup={companyGroup}
            directLinks={directLinks}
            labels={mobileMenuLabels}
          />

          {userData && (
            <HeaderUserMenu user={userData} labels={userMenuLabels} />
          )}
        </div>
      </div>
    </header>
  );
}
