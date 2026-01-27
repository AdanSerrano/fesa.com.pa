"use client";

import { memo } from "react";
import type { Control } from "react-hook-form";
import {
  FormDateField,
  FormTimeField,
} from "@/components/ui/form-fields";

interface DateTimeSectionProps {
  control: Control<any>;
}

function DateTimeSectionComponent({ control }: DateTimeSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormDateField
        control={control}
        name="dateField"
        label="Date Field"
        placeholder="Select a date..."
        description="Single date picker"
      />

      <FormTimeField
        control={control}
        name="timeField"
        label="Time Field"
        description="Time picker with hours and minutes"
        format="24h"
      />
    </div>
  );
}

export const DateTimeSection = memo(DateTimeSectionComponent);
DateTimeSection.displayName = "DateTimeSection";
