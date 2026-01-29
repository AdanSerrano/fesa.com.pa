"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { KeyRound } from "lucide-react";

function HeaderLogoComponent() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <KeyRound className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold">Nexus</span>
    </Link>
  );
}

export const HeaderLogo = memo(HeaderLogoComponent);
HeaderLogo.displayName = "HeaderLogo";
