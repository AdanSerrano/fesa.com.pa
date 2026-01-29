"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";

function HeaderLogoComponent() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary transition-all duration-300">
        FESA
      </span>
    </Link>
  );
}

export const HeaderLogo = memo(HeaderLogoComponent);
HeaderLogo.displayName = "HeaderLogo";
