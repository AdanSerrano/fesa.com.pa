"use client";

import { memo, useMemo } from "react";
import { Timeline } from "@/components/ui/timeline";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon?: string;
}

interface HistoryTimelineProps {
  milestones: Milestone[];
}

const HistoryTimelineComponent = memo(function HistoryTimelineInner({
  milestones,
}: HistoryTimelineProps) {
  const items = useMemo(() => milestones, [milestones]);

  return <Timeline milestones={items} />;
});

HistoryTimelineComponent.displayName = "HistoryTimeline";

export const HistoryTimeline = HistoryTimelineComponent;
