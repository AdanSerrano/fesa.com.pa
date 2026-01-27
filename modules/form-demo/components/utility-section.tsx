"use client";

import { memo, useRef, useCallback } from "react";
import type { Control } from "react-hook-form";
import {
  FormMaskField,
  FormArrayField,
  FormConfirmField,
} from "@/components/ui/form-fields";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UtilitySectionProps {
  control: Control<any>;
}

function UtilitySectionComponent({ control }: UtilitySectionProps) {
  const passwordRef = useRef("MyPassword123");

  const renderArrayItem = useCallback(
    ({ index, remove }: { index: number; field: Record<"id", string>; remove: () => void; isFirst: boolean; isLast: boolean }) => (
      <div className="flex items-center gap-2">
        <Input placeholder={`Item ${index + 1}`} className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={remove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    []
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormMaskField
        control={control}
        name="maskField"
        label="Mask Field (SSN)"
        placeholder="___-__-____"
        description="Input with pattern mask"
        mask="999-99-9999"
      />

      <FormConfirmField
        control={control}
        name="confirmField"
        label="Confirm Password Field"
        placeholder="Re-enter password..."
        description="Must match: MyPassword123"
        confirmValue={passwordRef.current}
        type="password"
        showMatchIndicator
      />

      <FormArrayField
        control={control}
        name="arrayField"
        label="Array Field"
        description="Dynamic list of items"
        className="md:col-span-2"
        addButtonLabel="Add Item"
        minItems={1}
        maxItems={5}
        renderItem={renderArrayItem}
      />
    </div>
  );
}

export const UtilitySection = memo(UtilitySectionComponent);
UtilitySection.displayName = "UtilitySection";
