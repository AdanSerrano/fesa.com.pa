import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, LayoutDashboard, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";

export async function HeroButtons() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const t = await getTranslations("HomePage");
  const tAuth = await getTranslations("Auth");
  const tNav = await getTranslations("Navigation");

  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/services">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {tNav("dashboard")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" disabled className="gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          {tAuth("loginSuccess")}
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
        <Link href="/login">
          <Lock className="mr-2 h-4 w-4" />
          {tAuth("login")}
        </Link>
      </Button>
    </div>
  );
}
