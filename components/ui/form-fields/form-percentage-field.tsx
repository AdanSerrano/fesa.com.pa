"use client";

import { memo, useCallback, useMemo } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface FormPercentageFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
  showInput?: boolean;
  decimals?: number;
  displayMode?: "input" | "slider" | "both";
}

function FormPercentageFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "0",
  disabled,
  className,
  required,
  min = 0,
  max = 100,
  step = 1,
  decimals = 0,
  displayMode = "both",
}: FormPercentageFieldProps<TFieldValues, TName>) {
  const formatValue = useCallback(
    (value: number | null | undefined): string => {
      if (value === null || value === undefined) return "";
      return value.toFixed(decimals);
    },
    [decimals]
  );

  const parseValue = useCallback(
    (input: string): number | null => {
      const cleaned = input.replace(/[^0-9.-]/g, "");
      const parsed = parseFloat(cleaned);
      if (isNaN(parsed)) return null;
      return Math.min(max, Math.max(min, parsed));
    },
    [min, max]
  );

  const sliderMarks = useMemo(() => {
    const marks: number[] = [min];
    const quarter = (max - min) / 4;
    marks.push(min + quarter, min + quarter * 2, min + quarter * 3, max);
    return marks;
  }, [min, max]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const currentValue = field.value ?? 0;

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = parseValue(e.target.value);
          field.onChange(value);
        };

        const handleSliderChange = (values: number[]) => {
          field.onChange(values[0]);
        };

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-4">
                {(displayMode === "input" || displayMode === "both") && (
                  <div className="relative">
                    <Input
                      type="number"
                      value={formatValue(currentValue)}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      disabled={disabled}
                      min={min}
                      max={max}
                      step={step}
                      className={cn(
                        "bg-background pr-10",
                        fieldState.error && "border-destructive"
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Percent className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {(displayMode === "slider" || displayMode === "both") && (
                  <div className="space-y-2 px-1">
                    <Slider
                      value={[currentValue]}
                      onValueChange={handleSliderChange}
                      min={min}
                      max={max}
                      step={step}
                      disabled={disabled}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      {sliderMarks.map((mark) => (
                        <span key={mark}>{mark}%</span>
                      ))}
                    </div>
                  </div>
                )}

                {displayMode === "slider" && (
                  <div className="text-center">
                    <span className="text-2xl font-bold">{formatValue(currentValue)}</span>
                    <span className="text-lg text-muted-foreground">%</span>
                  </div>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const FormPercentageField = memo(
  FormPercentageFieldComponent
) as typeof FormPercentageFieldComponent;
