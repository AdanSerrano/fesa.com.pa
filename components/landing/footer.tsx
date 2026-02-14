import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export async function Footer() {
  const tCommon = await getTranslations("Common");
  const tNav = await getTranslations("Navigation");
  const tFooter = await getTranslations("Footer");

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/FesaPanama", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/fesapanama", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/formas-eficientes-sa", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/FesaPanama", label: "Twitter" },
  ];

  const ecosystemLinks = [
    { name: "Fesa Store", href: "https://app.fesastore.com.pa" },
    { name: "Fesa ID", href: "https://id.fesa.com.pa" },
    { name: "Fesa Transfer", href: "https://transfer.fesa.com.pa" },
    { name: "Fesa Tracking", href: "https://tracking.fesa.com.pa" },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <span className="text-2xl font-black tracking-tight text-foreground">
              Fesa
            </span>
            <p className="text-sm text-muted-foreground max-w-xs">
              {tFooter("tagline")}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{tFooter("explore")}</h4>
            <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link href="/services" className="transition-colors hover:text-foreground w-fit">
                {tNav("services")}
              </Link>
              <Link href="/products" className="transition-colors hover:text-foreground w-fit">
                {tNav("products")}
              </Link>
              <Link href="/catalogs" className="transition-colors hover:text-foreground w-fit">
                {tNav("catalogs")}
              </Link>
              <Link href="/news" className="transition-colors hover:text-foreground w-fit">
                {tNav("news")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{tFooter("company")}</h4>
            <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link href="/about" className="transition-colors hover:text-foreground w-fit">
                {tNav("about")}
              </Link>
              <Link href="/contact" className="transition-colors hover:text-foreground w-fit">
                {tNav("contact")}
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-foreground w-fit">
                {tNav("privacy")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{tFooter("ecosystem")}</h4>
            <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              {ecosystemLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="transition-colors hover:text-foreground w-fit"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Formas Eficientes S.A.</p>
            <span className="hidden sm:inline">•</span>
            <p>{tCommon("allRightsReserved")}</p>
          </div>
          <Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground">
            {tNav("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
