import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  KeyRound,
  ArrowRight,
  User,
  Settings,
  Shield,
  Menu,
  Briefcase,
  Package,
  Newspaper,
  Home,
  LayoutDashboard,
} from "lucide-react";
import { LogoutButton } from "./logout-button";
import { currentUser } from "@/lib/user";
import { ModeToggleWrapper } from "@/components/mode-toggle-wrapper";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const user = await currentUser();
  const t = await getTranslations("Header");
  const tNav = await getTranslations("Navigation");

  const navLinks = [
    { href: "/services", label: tNav("services"), icon: Briefcase },
    { href: "/products", label: tNav("products"), icon: Package },
    { href: "/news", label: tNav("news"), icon: Newspaper },
    { href: "/contact", label: tNav("contact"), icon: Home },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <KeyRound className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Nexus</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard/overview"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {tNav("dashboard")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher compact />
          <ModeToggleWrapper />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <KeyRound className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Nexus
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
                {user && (
                  <Link
                    href="/dashboard/overview"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {tNav("dashboard")}
                  </Link>
                )}
                <div className="my-2 border-t" />
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} alt={user.name || "Usuario"} />
                        <AvatarFallback className="text-xs">
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        {user.name && <span className="text-sm font-medium line-clamp-1">{user.name}</span>}
                        {user.email && (
                          <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href="/dashboard/overview"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <User className="h-4 w-4" />
                      {t("myAccount")}
                    </Link>
                    <Link
                      href="/dashboard/settings/profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      {t("settings")}
                    </Link>
                    <Link
                      href="/dashboard/settings/security"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Shield className="h-4 w-4" />
                      {t("securityAudit")}
                    </Link>
                    <div className="my-2 border-t" />
                    <div className="px-3">
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-3">
                    <Button variant="outline" asChild>
                      <Link href="/login">{t("login")}</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">
                        {t("getStarted")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hidden lg:flex">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image || undefined} alt={user.name || "Usuario"} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none line">
                    {user.name && <p className="font-medium line-clamp-1">{user.name}</p>}
                    {user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NextLink href="/dashboard/overview" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {t("myAccount")}
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NextLink href="/dashboard/settings/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("settings")}
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NextLink href="/dashboard/settings/security" className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    {t("securityAudit")}
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">
                  {t("getStarted")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
