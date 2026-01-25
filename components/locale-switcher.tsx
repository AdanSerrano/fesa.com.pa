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

const localeConfig: Record<Locale, { name: string; flag: string }> = {
  es: { name: "Español", flag: "🇪🇸" },
  en: { name: "English", flag: "🇺🇸" },
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
          compact ? "w-[65px]" : "w-[140px]"
        } h-9 gap-1.5 `}
        aria-label="Seleccionar idioma"
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            <span className="text-lg leading-none">{currentConfig.flag}</span>
            {!compact && (
              <span className="text-sm">{currentConfig.name}</span>
            )}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="end" side="bottom" sideOffset={4}>
        {routing.locales.map((loc) => {
          const config = localeConfig[loc];
          return (
            <SelectItem key={loc} value={loc}>
              <span className="flex items-center gap-2">
                <span className="text-lg leading-none">{config.flag}</span>
                <span>{config.name}</span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export const LocaleSwitcher = memo(LocaleSwitcherComponent);
LocaleSwitcher.displayName = "LocaleSwitcher";
