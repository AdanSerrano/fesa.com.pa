"use client";

import { memo, useCallback, useMemo, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

function LocaleSwitcherComponent() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback(
    (newLocale: Locale) => {
      startTransition(() => {
        router.replace(pathname, { locale: newLocale });
      });
    },
    [pathname, router]
  );

  const renderedOptions = useMemo(
    () =>
      routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          disabled={isPending}
          onClick={() => handleChange(loc)}
          className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <Check
            className={`h-3.5 w-3.5 ${loc === locale ? "opacity-100" : "opacity-0"}`}
          />
          {localeNames[loc]}
        </button>
      )),
    [locale, isPending, handleChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          aria-label="Seleccionar idioma"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1" sideOffset={8}>
        <div className="flex flex-col">{renderedOptions}</div>
      </PopoverContent>
    </Popover>
  );
}

export const LocaleSwitcher = memo(LocaleSwitcherComponent);
LocaleSwitcher.displayName = "LocaleSwitcher";
