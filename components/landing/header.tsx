import { currentUser } from "@/lib/user";
import { ModeToggleWrapper } from "@/components/mode-toggle-wrapper";
import { LocaleSwitcherDynamic } from "@/components/locale-switcher-dynamic";
import {
  HeaderMobileMenuDynamic,
  HeaderUserMenuDynamic,
  HeaderNavDynamic,
  HeaderLogoDynamic,
} from "./header-dynamic";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const user = await currentUser();
  const t = await getTranslations("Header");
  const tNav = await getTranslations("Navigation");

  const navLinks = [
    { href: "/services", label: tNav("services"), iconName: "Briefcase" as const },
    { href: "/products", label: tNav("products"), iconName: "Package" as const },
    { href: "/catalogs", label: tNav("catalogs"), iconName: "BookOpen" as const },
    { href: "/news", label: tNav("news"), iconName: "Newspaper" as const },
    { href: "/about", label: tNav("about"), iconName: "Building2" as const },
    { href: "/contact", label: tNav("contact"), iconName: "Home" as const },
    { href: "/privacy", label: tNav("privacy"), iconName: "ShieldCheck" as const },
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

  const userData = user ? {
    name: user.name,
    email: user.email,
    image: user.image,
  } : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 [-webkit-transform:translateZ(0)]">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <HeaderLogoDynamic />

        <HeaderNavDynamic
          navLinks={navLinks.map(({ href, label }) => ({ href, label }))}
          showDashboard={!!user}
          dashboardLabel={tNav("dashboard")}
        />

        <div className="flex items-center gap-2">
          <LocaleSwitcherDynamic compact />
          <ModeToggleWrapper />

          <HeaderMobileMenuDynamic
            user={userData}
            navLinks={navLinks}
            labels={mobileMenuLabels}
          />

          {userData && (
            <HeaderUserMenuDynamic
              user={userData}
              labels={userMenuLabels}
            />
          )}
        </div>
      </div>
    </header>
  );
}
