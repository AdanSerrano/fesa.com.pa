import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

export async function Footer() {
  const tCommon = await getTranslations("Common");
  const tNav = await getTranslations("Navigation");
  const tFooter = await getTranslations("Footer");

  const socialLinks = [
    { icon: FacebookIcon, href: "https://facebook.com/FesaPanama", label: "Facebook" },
    { icon: InstagramIcon, href: "https://instagram.com/fesapanama", label: "Instagram" },
    { icon: LinkedinIcon, href: "https://linkedin.com/company/formas-eficientes-sa", label: "LinkedIn" },
    { icon: XIcon, href: "https://twitter.com/FesaPanama", label: "X" },
  ];

  const ecosystemLinks = [
    { name: "Fesa Store", href: "https://app.fesastore.com.pa" },
    { name: "Fesa ID", href: "https://id.fesa.com.pa" },
    { name: "Fesa Transfer", href: "https://transfer.fesa.com.pa" },
    { name: "Fesa Tracking", href: "https://tracking.fesa.com.pa" },
    { name: "Fesa Storage", href: "https://storage.fesa.com.pa" },
  ];

  return (
    <footer className="border-t bg-gradient-to-b from-muted/30 via-muted/40 to-muted/60 dark:from-muted/20 dark:via-muted/30 dark:to-muted/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all hover:bg-brand-600 hover:text-white hover:shadow-md hover:shadow-brand-500/20 hover:scale-110"
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

        <div className="mt-12 pt-8 border-t border-brand-200/20 dark:border-brand-800/20 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
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
