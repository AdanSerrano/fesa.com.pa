import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, LayoutDashboard, Package } from "lucide-react";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";

export async function CtaButtons() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const t = await getTranslations("HomePage");
  const tNav = await getTranslations("Navigation");

  if (isLoggedIn) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
        <Button size="lg" className="w-full min-w-[200px] sm:w-auto bg-white text-brand-950 hover:bg-brand-100 shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]" asChild>
          <Link href="/dashboard/overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {tNav("dashboard")}
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="w-full min-w-[200px] sm:w-auto border-brand-400/40 text-brand-200 hover:bg-brand-800/50 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]" asChild>
          <Link href="/catalogs">
            <Package className="mr-2 h-4 w-4" />
            {t("viewCatalogs")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
      <Button size="lg" className="w-full min-w-[200px] sm:w-auto bg-white text-brand-950 hover:bg-brand-100 shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]" asChild>
        <Link href="/contact">
          <Phone className="mr-2 h-4 w-4" />
          {t("contactUs")}
        </Link>
      </Button>
      <Button variant="outline" size="lg" className="w-full min-w-[200px] sm:w-auto border-brand-400/40 text-brand-200 hover:bg-brand-800/50 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]" asChild>
        <Link href="/catalogs">
          {t("viewCatalogs")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
