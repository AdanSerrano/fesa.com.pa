"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "../actions/logout.actions";
import { useTransition, memo } from "react";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export const LogoutButton = memo(function LogoutButton({
  variant = "ghost",
  size = "default",
  showIcon = true,
  showText = true,
  className,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isPending}
      aria-busy={isPending}
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {showText && <span className="ml-2">Cerrando sesión...</span>}
        </>
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4" aria-hidden="true" />}
          {showText && <span className={showIcon ? "ml-2" : ""}>Cerrar sesión</span>}
        </>
      )}
    </Button>
  );
});
