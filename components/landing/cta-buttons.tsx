import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, LayoutDashboard, Settings } from "lucide-react";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";

export async function CtaButtons() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const t = await getTranslations("HomePage");
  const tNav = await getTranslations("Navigation");

  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {tNav("dashboard")}
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard/settings/profile">
            <Settings className="mr-2 h-4 w-4" />
            {tNav("settings")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg" asChild>
        <Link href="/register">
          {t("getStarted")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link
          href="https://github.com/AdanSerrano/login-initial-structure-next-auth"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Link>
      </Button>
    </div>
  );
}

export async function BenefitsButton() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const t = await getTranslations("HomePage");
  const tNav = await getTranslations("Navigation");

  if (isLoggedIn) {
    return (
      <Button asChild>
        <Link href="/dashboard/overview">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {tNav("dashboard")}
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild>
      <Link href="/register">
        {t("getStarted")}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}
