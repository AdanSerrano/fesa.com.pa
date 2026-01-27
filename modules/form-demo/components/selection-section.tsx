"use client";

import { memo, useMemo } from "react";
import type { Control } from "react-hook-form";
import {
  FormSelectField,
  FormComboboxField,
  FormMultiSelectField,
  FormRadioGroupField,
  FormCheckboxField,
  FormSwitchField,
} from "@/components/ui/form-fields";
import { Apple, Cherry, Grape } from "lucide-react";

interface SelectionSectionProps {
  control: Control<any>;
}

function SelectionSectionComponent({ control }: SelectionSectionProps) {
  const fruitOptions = useMemo(
    () => [
      { value: "apple", label: "Apple", icon: Apple },
      { value: "cherry", label: "Cherry", icon: Cherry },
      { value: "grape", label: "Grape", icon: Grape },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
    []
  );

  const groupedOptions = useMemo(
    () => [
      {
        label: "Fruits",
        options: [
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
        ],
      },
      {
        label: "Vegetables",
        options: [
          { value: "carrot", label: "Carrot" },
          { value: "broccoli", label: "Broccoli" },
        ],
      },
    ],
    []
  );

  const radioOptions = useMemo(
    () => [
      { value: "small", label: "Small", description: "Best for individuals" },
      { value: "medium", label: "Medium", description: "Best for small teams" },
      { value: "large", label: "Large", description: "Best for enterprises" },
    ],
    []
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormSelectField
        control={control}
        name="selectField"
        label="Select Field"
        placeholder="Select an option..."
        description="Single selection dropdown"
        options={fruitOptions}
      />

      <FormComboboxField
        control={control}
        name="comboboxField"
        label="Combobox Field"
        placeholder="Search and select..."
        description="Searchable dropdown"
        options={fruitOptions}
      />

      <FormMultiSelectField
        control={control}
        name="multiSelectField"
        label="Multi-Select Field"
        placeholder="Select multiple..."
        description="Multiple selection"
        options={fruitOptions}
      />

      <FormRadioGroupField
        control={control}
        name="radioGroupField"
        label="Radio Group Field"
        description="Single choice from options"
        options={radioOptions}
      />

      <FormCheckboxField
        control={control}
        name="checkboxField"
        label="Checkbox Field"
        description="Toggle a boolean value"
      />

      <FormSwitchField
        control={control}
        name="switchField"
        label="Switch Field"
        description="Toggle with switch UI"
      />
    </div>
  );
}

export const SelectionSection = memo(SelectionSectionComponent);
SelectionSection.displayName = "SelectionSection";
