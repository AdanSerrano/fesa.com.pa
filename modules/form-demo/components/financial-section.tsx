"use client";

import { memo } from "react";
import type { Control } from "react-hook-form";
import {
  FormCreditCardField,
  FormIBANField,
  FormPercentageField,
} from "@/components/ui/form-fields";

interface FinancialSectionProps {
  control: Control<any>;
}

function FinancialSectionComponent({ control }: FinancialSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormCreditCardField
        control={control}
        name="creditCardField"
        label="Credit Card Field"
        description="Card number with type detection"
        showCardType
      />

      <FormIBANField
        control={control}
        name="ibanField"
        label="IBAN Field"
        placeholder="Enter IBAN..."
        description="International Bank Account Number"
      />

      <FormPercentageField
        control={control}
        name="percentageField"
        label="Percentage Field"
        description="Value from 0% to 100%"
        min={0}
        max={100}
        showSlider
      />
    </div>
  );
}

export const FinancialSection = memo(FinancialSectionComponent);
FinancialSection.displayName = "FinancialSection";
