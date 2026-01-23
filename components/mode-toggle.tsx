"use client";

import { memo, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

function ModeToggleComponent() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out scale-100 rotate-0 dark:scale-0 dark:-rotate-90 dark:opacity-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out scale-0 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100" />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}

export const ModeToggle = memo(ModeToggleComponent);
ModeToggle.displayName = "ModeToggle";
