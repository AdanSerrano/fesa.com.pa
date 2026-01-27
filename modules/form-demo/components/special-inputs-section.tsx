"use client";

import { memo, useMemo } from "react";
import type { Control } from "react-hook-form";
import {
  FormOTPField,
  FormSliderField,
  FormFileField,
  FormColorField,
  FormToggleGroupField,
  FormTagField,
  FormPhoneField,
  FormCurrencyField,
  FormRatingField,
  FormAutoCompleteField,
} from "@/components/ui/form-fields";
import { Bold, Italic, Underline } from "lucide-react";

interface SpecialInputsSectionProps {
  control: Control<any>;
}

function SpecialInputsSectionComponent({ control }: SpecialInputsSectionProps) {
  const toggleOptions = useMemo(
    () => [
      { value: "bold", label: "Bold", icon: Bold },
      { value: "italic", label: "Italic", icon: Italic },
      { value: "underline", label: "Underline", icon: Underline },
    ],
    []
  );

  const tagSuggestions = useMemo(
    () => [
      { value: "react", label: "React", color: "#61dafb" },
      { value: "typescript", label: "TypeScript", color: "#3178c6" },
      { value: "nextjs", label: "Next.js", color: "#000000" },
      { value: "tailwind", label: "Tailwind", color: "#06b6d4" },
    ],
    []
  );

  const autocompleteOptions = useMemo(
    () => [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "rust", label: "Rust" },
      { value: "go", label: "Go" },
    ],
    []
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormOTPField
        control={control}
        name="otpField"
        label="OTP Field"
        description="6-digit verification code"
        length={6}
      />

      <FormSliderField
        control={control}
        name="sliderField"
        label="Slider Field"
        description="Value between 0 and 100"
        min={0}
        max={100}
        step={1}
        showValue
      />

      <FormFileField
        control={control}
        name="fileField"
        label="File Field"
        description="Upload files (max 5MB)"
        accept="image/png,image/jpeg"
        maxSize={5 * 1024 * 1024}
        showPreview
      />

      <FormColorField
        control={control}
        name="colorField"
        label="Color Field"
        description="Pick a color"
        showInput
      />

      <FormToggleGroupField
        control={control}
        name="toggleGroupField"
        label="Toggle Group Field"
        description="Multiple toggles"
        options={toggleOptions}
        type="multiple"
      />

      <FormTagField
        control={control}
        name="tagField"
        label="Tag Field"
        placeholder="Add tags..."
        description="Add multiple tags"
        suggestions={tagSuggestions}
        maxTags={5}
      />

      <FormPhoneField
        control={control}
        name="phoneField"
        label="Phone Field"
        placeholder="Enter phone number..."
        description="International phone number"
        defaultCountry="US"
      />

      <FormCurrencyField
        control={control}
        name="currencyField"
        label="Currency Field"
        placeholder="0.00"
        description="Money input"
        defaultCurrency="USD"
        showCurrencySelect
      />

      <FormRatingField
        control={control}
        name="ratingField"
        label="Rating Field"
        description="Rate from 1 to 5"
        max={5}
        allowHalf
        showValue
      />

      <FormAutoCompleteField
        control={control}
        name="autocompleteField"
        label="Autocomplete Field"
        placeholder="Search..."
        description="Type to search"
        suggestions={autocompleteOptions}
        allowFreeText
        showIcon
      />
    </div>
  );
}

export const SpecialInputsSection = memo(SpecialInputsSectionComponent);
SpecialInputsSection.displayName = "SpecialInputsSection";
