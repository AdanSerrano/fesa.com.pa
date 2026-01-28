import { Link } from "@/i18n/navigation";
import { KeyRound } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const tAuth = await getTranslations("Auth");
  const tCommon = await getTranslations("Common");
  const tNav = await getTranslations("Navigation");

  return (
    <footer className="border-t py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
              <KeyRound className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-semibold">Nexus</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              {tNav("home")}
            </Link>
            <Link href="/services" className="transition-colors hover:text-foreground">
              {tNav("services")}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              {tNav("contact")}
            </Link>
            <Link href="/login" className="transition-colors hover:text-foreground">
              {tAuth("login")}
            </Link>
          </nav>

          <p className="text-xs sm:text-sm text-muted-foreground">
            {new Date().getFullYear()} Nexus. {tCommon("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
