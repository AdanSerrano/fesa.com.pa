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
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {tNav("dashboard")}
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/catalogs">
            <Package className="mr-2 h-4 w-4" />
            {t("viewCatalogs")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg" asChild>
        <Link href="/contact">
          <Phone className="mr-2 h-4 w-4" />
          {t("contactUs")}
        </Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link href="/catalogs">
          {t("viewCatalogs")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
