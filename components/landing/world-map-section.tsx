"use client";

import { memo, useMemo } from "react";
import { WorldMap } from "@/components/ui/world-map";

interface WorldMapSectionLabels {
  hub: string;
  hubLat: number;
  hubLng: number;
  locations: { label: string; lat: number; lng: number }[];
}

interface WorldMapSectionProps {
  labels: WorldMapSectionLabels;
}

const WorldMapSectionComponent = memo(function WorldMapSectionInner({
  labels,
}: WorldMapSectionProps) {
  const dots = useMemo(
    () =>
      labels.locations.map((loc, i) => ({
        start: {
          lat: labels.hubLat,
          lng: labels.hubLng,
          label: i === 0 ? labels.hub : undefined,
        },
        end: {
          lat: loc.lat,
          lng: loc.lng,
          label: loc.label,
        },
      })),
    [labels]
  );

  const markers = useMemo(
    () =>
      labels.locations.length === 0
        ? [{ lat: labels.hubLat, lng: labels.hubLng, label: labels.hub }]
        : [],
    [labels]
  );

  return <WorldMap dots={dots} markers={markers} lineColor="#3b82f6" />;
});

WorldMapSectionComponent.displayName = "WorldMapSection";

export const WorldMapSection = WorldMapSectionComponent;
