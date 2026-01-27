"use client";

import { memo, useCallback, useMemo } from "react";
import type { FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import type { BaseFormFieldProps, DateRange, DatePreset } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
}

const DEFAULT_DATE_PRESETS: DatePreset[] = [
  { label: "Today", getValue: () => new Date() },
  {
    label: "Tomorrow",
    getValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    },
  },
  {
    label: "In 7 days",
    getValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
  },
  {
    label: "In 30 days",
    getValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    },
  },
];

const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 7);
      return { from, to };
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from, to };
    },
  },
  {
    label: "This month",
    getValue: () => {
      const from = new Date();
      from.setDate(1);
      const to = new Date();
      return { from, to };
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const to = new Date();
      to.setDate(0);
      const from = new Date(to);
      from.setDate(1);
      return { from, to };
    },
  },
];

export interface FormDateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDays?: (date: Date) => boolean;
  locale?: string;
  formatDate?: (date: Date) => string;
  triggerClassName?: string;
  presets?: DatePreset[];
  showPresets?: boolean;
}

const defaultFormatDate = (date: Date, locale = "en-US") =>
  date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

interface DateContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  placeholder: string;
  disabled?: boolean;
  hasError: boolean;
  triggerClassName?: string;
  format: (date: Date) => string;
  isDateDisabled: (date: Date) => boolean;
  activePresets: DatePreset[];
  onPresetClick: (preset: DatePreset) => void;
}

const DateContent = memo(function DateContent({
  field,
  placeholder,
  disabled,
  hasError,
  triggerClassName,
  format,
  isDateDisabled,
  activePresets,
  onPresetClick,
}: DateContentProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal bg-background",
              !field.value && "text-muted-foreground",
              hasError && "border-destructive",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? format(field.value) : placeholder}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {activePresets.length > 0 && (
            <div className="flex flex-col gap-1 p-3 border-r">
              {activePresets.map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => onPresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={isDateDisabled}
            defaultMonth={field.value}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
});

function FormDateFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date",
  disabled,
  className,
  required,
  tooltip,
  minDate,
  maxDate,
  disabledDates,
  disabledDays,
  locale = "en-US",
  formatDate,
  triggerClassName,
  presets,
  showPresets = false,
}: FormDateFieldProps<TFieldValues, TName>) {
  const activePresets = useMemo(
    () => (showPresets ? (presets ?? DEFAULT_DATE_PRESETS) : []),
    [showPresets, presets]
  );

  const format = useCallback(
    (date: Date) => formatDate?.(date) ?? defaultFormatDate(date, locale),
    [formatDate, locale]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (disabledDates?.some((d) => d.toDateString() === date.toDateString()))
        return true;
      if (disabledDays?.(date)) return true;
      return false;
    },
    [minDate, maxDate, disabledDates, disabledDays]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handlePresetClick = (preset: DatePreset) => {
          const date = preset.getValue();
          field.onChange(date);
        };

        return (
          <FormItem className={cn("flex flex-col", className)}>
            {label && (
              <div className="flex items-center gap-1.5">
                <FormLabel>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                {tooltip && <FormFieldTooltip tooltip={tooltip} />}
              </div>
            )}
            <DateContent
              field={field as unknown as ControllerRenderProps<FieldValues, string>}
              placeholder={placeholder}
              disabled={disabled}
              hasError={!!fieldState.error}
              triggerClassName={triggerClassName}
              format={format}
              isDateDisabled={isDateDisabled}
              activePresets={activePresets}
              onPresetClick={handlePresetClick}
            />
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const FormDateField = memo(
  FormDateFieldComponent
) as typeof FormDateFieldComponent;

export interface FormDateRangeFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDays?: (date: Date) => boolean;
  locale?: string;
  formatDate?: (date: Date) => string;
  numberOfMonths?: 1 | 2;
  triggerClassName?: string;
  presets?: DateRangePreset[];
  showPresets?: boolean;
}

interface DateRangeContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  placeholder: string;
  disabled?: boolean;
  hasError: boolean;
  triggerClassName?: string;
  format: (date: Date) => string;
  isDateDisabled: (date: Date) => boolean;
  activePresets: DateRangePreset[];
  numberOfMonths: 1 | 2;
  onPresetClick: (preset: DateRangePreset) => void;
}

const DateRangeContent = memo(function DateRangeContent({
  field,
  placeholder,
  disabled,
  hasError,
  triggerClassName,
  format,
  isDateDisabled,
  activePresets,
  numberOfMonths,
  onPresetClick,
}: DateRangeContentProps) {
  const range = field.value as DateRange | undefined;

  const displayValue = range?.from
    ? range.to
      ? `${format(range.from)} - ${format(range.to)}`
      : format(range.from)
    : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal bg-background",
              !range?.from && "text-muted-foreground",
              hasError && "border-destructive",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {activePresets.length > 0 && (
            <div className="flex flex-col gap-1 p-3 border-r">
              {activePresets.map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => onPresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}
          <Calendar
            mode="range"
            selected={range}
            onSelect={field.onChange}
            disabled={isDateDisabled}
            numberOfMonths={numberOfMonths}
            defaultMonth={range?.from}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
});

function FormDateRangeFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date range",
  disabled,
  className,
  required,
  tooltip,
  minDate,
  maxDate,
  disabledDates,
  disabledDays,
  locale = "en-US",
  formatDate,
  numberOfMonths = 2,
  triggerClassName,
  presets,
  showPresets = false,
}: FormDateRangeFieldProps<TFieldValues, TName>) {
  const activePresets = useMemo(
    () => (showPresets ? (presets ?? DEFAULT_DATE_RANGE_PRESETS) : []),
    [showPresets, presets]
  );

  const format = useCallback(
    (date: Date) => formatDate?.(date) ?? defaultFormatDate(date, locale),
    [formatDate, locale]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (disabledDates?.some((d) => d.toDateString() === date.toDateString()))
        return true;
      if (disabledDays?.(date)) return true;
      return false;
    },
    [minDate, maxDate, disabledDates, disabledDays]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handlePresetClick = (preset: DateRangePreset) => {
          const range = preset.getValue();
          field.onChange(range);
        };

        return (
          <FormItem className={cn("flex flex-col", className)}>
            {label && (
              <div className="flex items-center gap-1.5">
                <FormLabel>
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                {tooltip && <FormFieldTooltip tooltip={tooltip} />}
              </div>
            )}
            <DateRangeContent
              field={field as unknown as ControllerRenderProps<FieldValues, string>}
              placeholder={placeholder}
              disabled={disabled}
              hasError={!!fieldState.error}
              triggerClassName={triggerClassName}
              format={format}
              isDateDisabled={isDateDisabled}
              activePresets={activePresets}
              numberOfMonths={numberOfMonths}
              onPresetClick={handlePresetClick}
            />
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const FormDateRangeField = memo(
  FormDateRangeFieldComponent
) as typeof FormDateRangeFieldComponent;
