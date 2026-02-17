"use client";

import { memo, useMemo } from "react";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Shield } from "lucide-react";
import { LogoutButton } from "./logout-button";

interface HeaderUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  labels: {
    myAccount: string;
    settings: string;
    securityAudit: string;
  };
}

const menuItemClass =
  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none transition-colors hover:bg-accent hover:text-accent-foreground";

function HeaderUserMenuComponent({ user, labels }: HeaderUserMenuProps) {
  const menuLinks = useMemo(
    () => [
      { href: "/dashboard/overview", icon: User, label: labels.myAccount },
      { href: "/dashboard/settings/profile", icon: Settings, label: labels.settings },
      { href: "/dashboard/settings/security", icon: Shield, label: labels.securityAudit },
    ],
    [labels]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full hidden lg:flex">
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
          {menuLinks.map((link) => (
            <NextLink key={link.href} href={link.href} className={menuItemClass}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </NextLink>
          ))}
        </div>
        <div className="bg-border -mx-1 my-1 h-px" />
        <LogoutButton variant="popover" />
      </PopoverContent>
    </Popover>
  );
}

export const HeaderUserMenu = memo(HeaderUserMenuComponent);
HeaderUserMenu.displayName = "HeaderUserMenu";
