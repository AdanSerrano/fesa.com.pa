"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeaderAuthButtonsProps {
  labels: {
    login: string;
    getStarted: string;
  };
}

function HeaderAuthButtonsComponent({ labels }: HeaderAuthButtonsProps) {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">{labels.login}</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">
          {labels.getStarted}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export const HeaderAuthButtons = memo(HeaderAuthButtonsComponent);
HeaderAuthButtons.displayName = "HeaderAuthButtons";
