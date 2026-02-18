"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { BrandName } from "./brand-name";

function HeaderLogoComponent() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <BrandName />
    </Link>
  );
}

export const HeaderLogo = memo(HeaderLogoComponent);
HeaderLogo.displayName = "HeaderLogo";
