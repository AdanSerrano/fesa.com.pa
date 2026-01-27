"use client";

import { memo } from "react";
import type { Control } from "react-hook-form";
import {
  FormDurationField,
  FormScheduleField,
  FormRecurrenceField,
} from "@/components/ui/form-fields";

interface AdvancedTimeSectionProps {
  control: Control<any>;
}

function AdvancedTimeSectionComponent({ control }: AdvancedTimeSectionProps) {
  return (
    <div className="grid gap-6">
      <FormDurationField
        control={control}
        name="durationField"
        label="Duration Field"
        description="Time duration in hours, minutes, seconds"
        showHours
        showMinutes
        showSeconds
      />

      <FormScheduleField
        control={control}
        name="scheduleField"
        label="Schedule Field"
        description="Weekly schedule with time slots"
      />

      <FormRecurrenceField
        control={control}
        name="recurrenceField"
        label="Recurrence Field"
        description="Recurring event pattern"
        showPreview
      />
    </div>
  );
}

export const AdvancedTimeSection = memo(AdvancedTimeSectionComponent);
AdvancedTimeSection.displayName = "AdvancedTimeSection";
