"use client";

import { memo, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Store,
  Send,
  MapPin,
  Database,
  IdCard,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface AppItem {
  name: string;
  description: string;
  href: string;
  iconName: string;
  color: string;
}

interface AppLauncherProps {
  apps: AppItem[];
  title: string;
}

const ICON_MAP = {
  store: Store,
  send: Send,
  mapPin: MapPin,
  database: Database,
  idCard: IdCard,
} as const;

const AppCard = memo(function AppCard({ app }: { app: AppItem }) {
  const Icon = ICON_MAP[app.iconName as keyof typeof ICON_MAP] || Store;

  return (
    <a
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-accent"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${app.color} text-white shadow-sm transition-transform group-hover:scale-105`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight truncate">{app.name}</p>
        <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
          {app.description}
        </p>
      </div>
    </a>
  );
});
AppCard.displayName = "AppCard";

function AppLauncherComponent({ apps, title }: AppLauncherProps) {
  const renderedApps = useMemo(
    () => apps.map((app) => <AppCard key={app.name} app={app} />),
    [apps]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg"
          aria-label={title}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-2"
        sideOffset={8}
      >
        <div className="flex flex-col">{renderedApps}</div>
        <div className="mt-1.5 pt-1.5 border-t mx-2">
          <Link
            href="https://fesa.com.pa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1.5"
          >
            <ExternalLink className="h-3 w-3" />
            fesa.com.pa
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const AppLauncher = memo(AppLauncherComponent);
AppLauncher.displayName = "AppLauncher";
