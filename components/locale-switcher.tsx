"use client";

import { memo, useCallback, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const localeConfig: Record<Locale, { name: string; code: string }> = {
  es: { name: "Español", code: "ES" },
  en: { name: "English", code: "EN" },
};

interface LocaleSwitcherProps {
  compact?: boolean;
}

function LocaleSwitcherComponent({ compact = false }: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback(
    (newLocale: string) => {
      startTransition(() => {
        router.replace(pathname, { locale: newLocale as Locale });
      });
    },
    [pathname, router]
  );

  const currentConfig = localeConfig[locale];

  return (
    <Select value={locale} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger
        className={`${
          compact ? "w-[70px]" : "w-[130px]"
        } h-9`}
        aria-label="Seleccionar idioma"
      >
        <SelectValue>
          <span className="text-sm font-semibold">{currentConfig.code}</span>
          {!compact && (
            <span className="text-sm ml-1.5">{currentConfig.name}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="end" side="bottom" sideOffset={4}>
        {routing.locales.map((loc) => {
          const config = localeConfig[loc];
          return (
            <SelectItem key={loc} value={loc}>
              {config.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export const LocaleSwitcher = memo(LocaleSwitcherComponent);
LocaleSwitcher.displayName = "LocaleSwitcher";
