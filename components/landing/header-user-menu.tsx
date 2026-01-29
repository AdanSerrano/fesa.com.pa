"use client";

import { memo } from "react";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function HeaderUserMenuComponent({ user, labels }: HeaderUserMenuProps) {
  return (
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
            {labels.myAccount}
          </NextLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NextLink href="/dashboard/settings/profile" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            {labels.settings}
          </NextLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NextLink href="/dashboard/settings/security" className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            {labels.securityAudit}
          </NextLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const HeaderUserMenu = memo(HeaderUserMenuComponent);
HeaderUserMenu.displayName = "HeaderUserMenu";
