"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";

function HeaderLogoComponent() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <span className="text-2xl font-black tracking-tight text-foreground transition-colors duration-300">
        Fesa
      </span>
    </Link>
  );
}

export const HeaderLogo = memo(HeaderLogoComponent);
HeaderLogo.displayName = "HeaderLogo";
