import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, LayoutDashboard } from "lucide-react";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";

export async function HeroButtons() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const t = await getTranslations("HomePage");
  const tNav = await getTranslations("Navigation");

  if (isLoggedIn) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row lg:justify-start">
        <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-xl w-full min-w-[200px] sm:w-auto shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30" asChild>
          <Link href="/dashboard/overview">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            {tNav("dashboard")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold rounded-xl w-full min-w-[200px] sm:w-auto transition-all" asChild>
          <Link href="/services">
            {t("exploreServices")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row lg:justify-start">
      <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-xl w-full min-w-[200px] sm:w-auto shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30" asChild>
        <Link href="/services">
          {t("exploreServices")}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold rounded-xl w-full min-w-[200px] sm:w-auto transition-all" asChild>
        <Link href="/contact">
          <Phone className="mr-2 h-5 w-5" />
          {t("contactUs")}
        </Link>
      </Button>
    </div>
  );
}
