"use client";

import { memo } from "react";
import type { Control } from "react-hook-form";
import {
  FormTextField,
  FormPasswordField,
  FormTextareaField,
  FormNumberField,
} from "@/components/ui/form-fields";
import { User } from "lucide-react";

interface BasicInputsSectionProps {
  control: Control<any>;
}

function BasicInputsSectionComponent({ control }: BasicInputsSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormTextField
        control={control}
        name="textField"
        label="Text Field"
        placeholder="Enter text..."
        description="A basic text input field"
        leftIcon={<User className="h-4 w-4" />}
        required
      />

      <FormPasswordField
        control={control}
        name="passwordField"
        label="Password Field"
        placeholder="Enter password..."
        description="Password with strength indicator"
        showStrengthIndicator
        required
      />

      <FormTextareaField
        control={control}
        name="textareaField"
        label="Textarea Field"
        placeholder="Enter long text..."
        description="Multi-line text input"
        minRows={3}
        maxRows={6}
        showCharCount
        maxLength={500}
        className="md:col-span-2"
      />

      <FormNumberField
        control={control}
        name="numberField"
        label="Number Field"
        placeholder="Enter number..."
        description="Numeric input with stepper"
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}

export const BasicInputsSection = memo(BasicInputsSectionComponent);
BasicInputsSection.displayName = "BasicInputsSection";
