import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Settings,
  Shield,
  LayoutDashboard,
  Home,
} from "lucide-react";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/landing/logout-button";
import { ModeToggle } from "@/components/mode-toggle";

const menuItemClass =
  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none transition-colors hover:bg-accent hover:text-accent-foreground";

export async function DashboardHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Fesa</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Inicio
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/overview">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Panel
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/settings/profile">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/settings/security">
              <Shield className="mr-2 h-4 w-4" />
              Seguridad
            </Link>
          </Button>
          <ModeToggle />
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image || undefined} alt={user.name || "Usuario"} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1" align="end" sideOffset={8}>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && <p className="font-medium line-clamp-1">{user.name}</p>}
                    {user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-border -mx-1 my-1 h-px" />
                <div className="flex flex-col">
                  <Link href="/dashboard/overview" className={menuItemClass}>
                    <User className="h-4 w-4" />
                    Mi cuenta
                  </Link>
                  <Link href="/dashboard/settings/profile" className={menuItemClass}>
                    <Settings className="h-4 w-4" />
                    Configuración
                  </Link>
                  <Link href="/dashboard/settings/security" className={menuItemClass}>
                    <Shield className="h-4 w-4" />
                    Seguridad
                  </Link>
                </div>
                <div className="bg-border -mx-1 my-1 h-px" />
                <LogoutButton variant="popover" />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
}
