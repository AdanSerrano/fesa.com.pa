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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { BaseFormFieldProps, TimeValue, TimeRange } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface FormTimeFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  format?: "12h" | "24h";
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  triggerClassName?: string;
}

function formatTime(time: TimeValue, format: "12h" | "24h"): string {
  const { hours, minutes } = time;
  const paddedMinutes = minutes.toString().padStart(2, "0");

  if (format === "24h") {
    const paddedHours = hours.toString().padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}`;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${paddedMinutes} ${period}`;
}

function generateHours(format: "12h" | "24h"): number[] {
  if (format === "24h") {
    return Array.from({ length: 24 }, (_, i) => i);
  }
  return Array.from({ length: 12 }, (_, i) => i || 12);
}

function generateMinutes(step: number): number[] {
  return Array.from({ length: 60 / step }, (_, i) => i * step);
}

function isTimeDisabled(
  hours: number,
  minutes: number,
  minTime?: TimeValue,
  maxTime?: TimeValue
): boolean {
  const timeInMinutes = hours * 60 + minutes;

  if (minTime) {
    const minInMinutes = minTime.hours * 60 + minTime.minutes;
    if (timeInMinutes < minInMinutes) return true;
  }

  if (maxTime) {
    const maxInMinutes = maxTime.hours * 60 + maxTime.minutes;
    if (timeInMinutes > maxInMinutes) return true;
  }

  return false;
}

interface TimeContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  placeholder: string;
  disabled?: boolean;
  hasError: boolean;
  triggerClassName?: string;
  format: "12h" | "24h";
  hours: number[];
  minutes: number[];
  minTime?: TimeValue;
  maxTime?: TimeValue;
}

const TimeContent = memo(function TimeContent({
  field,
  placeholder,
  disabled,
  hasError,
  triggerClassName,
  format,
  hours,
  minutes,
  minTime,
  maxTime,
}: TimeContentProps) {
  const value: TimeValue | undefined = field.value;

  const handleSelect = useCallback(
    (h: number, m: number) => {
      let actualHours = h;
      if (format === "12h" && value) {
        const isPM = (value.hours ?? 0) >= 12;
        if (h === 12) {
          actualHours = isPM ? 12 : 0;
        } else {
          actualHours = isPM ? h + 12 : h;
        }
      }
      field.onChange({ hours: actualHours, minutes: m });
    },
    [field, format, value]
  );

  const handlePeriodChange = useCallback(
    (period: "AM" | "PM") => {
      if (!value) return;
      let newHours = value.hours;
      if (period === "AM" && newHours >= 12) {
        newHours -= 12;
      } else if (period === "PM" && newHours < 12) {
        newHours += 12;
      }
      field.onChange({ ...value, hours: newHours });
    },
    [field, value]
  );

  const currentPeriod = value ? (value.hours >= 12 ? "PM" : "AM") : "AM";
  const displayHours = value
    ? format === "12h"
      ? value.hours % 12 || 12
      : value.hours
    : null;

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
              !value && "text-muted-foreground",
              hasError && "border-destructive",
              triggerClassName
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value ? formatTime(value, format) : placeholder}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <ScrollArea className="h-[200px] w-[70px] border-r">
            <div className="p-2">
              {hours.map((h) => {
                const isSelected = displayHours === h;
                return (
                  <Button
                    key={h}
                    type="button"
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className="w-full mb-1"
                    onClick={() =>
                      handleSelect(
                        format === "12h" && currentPeriod === "PM" && h !== 12
                          ? h + 12
                          : format === "12h" && currentPeriod === "AM" && h === 12
                            ? 0
                            : h,
                        value?.minutes ?? 0
                      )
                    }
                  >
                    {h.toString().padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
          <ScrollArea className="h-[200px] w-[70px] border-r">
            <div className="p-2">
              {minutes.map((m) => {
                const isSelected = value?.minutes === m;
                const isDisabled =
                  value &&
                  isTimeDisabled(value.hours, m, minTime, maxTime);
                return (
                  <Button
                    key={m}
                    type="button"
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className="w-full mb-1"
                    disabled={isDisabled}
                    onClick={() =>
                      handleSelect(value?.hours ?? 0, m)
                    }
                  >
                    {m.toString().padStart(2, "0")}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
          {format === "12h" && (
            <div className="p-2 flex flex-col gap-1">
              <Button
                type="button"
                variant={currentPeriod === "AM" ? "default" : "ghost"}
                size="sm"
                onClick={() => handlePeriodChange("AM")}
              >
                AM
              </Button>
              <Button
                type="button"
                variant={currentPeriod === "PM" ? "default" : "ghost"}
                size="sm"
                onClick={() => handlePeriodChange("PM")}
              >
                PM
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

function FormTimeFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Select time",
  disabled,
  className,
  required,
  tooltip,
  format = "12h",
  minuteStep = 15,
  minTime,
  maxTime,
  triggerClassName,
}: FormTimeFieldProps<TFieldValues, TName>) {
  const hours = useMemo(() => generateHours(format), [format]);
  const minutes = useMemo(() => generateMinutes(minuteStep), [minuteStep]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
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
          <TimeContent
            field={field as unknown as ControllerRenderProps<FieldValues, string>}
            placeholder={placeholder}
            disabled={disabled}
            hasError={!!fieldState.error}
            triggerClassName={triggerClassName}
            format={format}
            hours={hours}
            minutes={minutes}
            minTime={minTime}
            maxTime={maxTime}
          />
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormTimeField = memo(
  FormTimeFieldComponent
) as typeof FormTimeFieldComponent;

export interface FormTimeRangeFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  format?: "12h" | "24h";
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  labels?: {
    from?: string;
    to?: string;
  };
}

interface TimeRangePickerProps {
  selectedTime: TimeValue | undefined;
  onSelect: (hours: number, minutes: number) => void;
  placeholder: string;
  disabled?: boolean;
  hasError: boolean;
  format: "12h" | "24h";
  hours: number[];
  minutes: number[];
}

const TimeRangePicker = memo(function TimeRangePicker({
  selectedTime,
  onSelect,
  placeholder,
  disabled,
  hasError,
  format,
  hours,
  minutes,
}: TimeRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "flex-1 justify-start text-left font-normal bg-background",
            !selectedTime && "text-muted-foreground",
            hasError && "border-destructive"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime ? formatTime(selectedTime, format) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <ScrollArea className="h-[200px] w-[70px] border-r">
            <div className="p-2">
              {hours.map((h) => (
                <Button
                  key={h}
                  type="button"
                  variant={
                    selectedTime?.hours === h ? "default" : "ghost"
                  }
                  size="sm"
                  className="w-full mb-1"
                  onClick={() => onSelect(h, selectedTime?.minutes ?? 0)}
                >
                  {h.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <ScrollArea className="h-[200px] w-[70px]">
            <div className="p-2">
              {minutes.map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={
                    selectedTime?.minutes === m ? "default" : "ghost"
                  }
                  size="sm"
                  className="w-full mb-1"
                  onClick={() => onSelect(selectedTime?.hours ?? 0, m)}
                >
                  {m.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
});

interface TimeRangeContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  disabled?: boolean;
  hasError: boolean;
  format: "12h" | "24h";
  hours: number[];
  minutes: number[];
  mergedLabels: { from: string; to: string };
}

const TimeRangeContent = memo(function TimeRangeContent({
  field,
  disabled,
  hasError,
  format,
  hours,
  minutes,
  mergedLabels,
}: TimeRangeContentProps) {
  const value: TimeRange = field.value ?? { from: undefined, to: undefined };

  const handleFromChange = useCallback(
    (h: number, m: number) => {
      field.onChange({ ...value, from: { hours: h, minutes: m } });
    },
    [field, value]
  );

  const handleToChange = useCallback(
    (h: number, m: number) => {
      field.onChange({ ...value, to: { hours: h, minutes: m } });
    },
    [field, value]
  );

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <span className="text-xs text-muted-foreground mb-1 block">
          {mergedLabels.from}
        </span>
        <TimeRangePicker
          selectedTime={value.from}
          onSelect={handleFromChange}
          placeholder="Start"
          disabled={disabled}
          hasError={hasError}
          format={format}
          hours={hours}
          minutes={minutes}
        />
      </div>
      <span className="text-muted-foreground mt-5">-</span>
      <div className="flex-1">
        <span className="text-xs text-muted-foreground mb-1 block">
          {mergedLabels.to}
        </span>
        <TimeRangePicker
          selectedTime={value.to}
          onSelect={handleToChange}
          placeholder="End"
          disabled={disabled}
          hasError={hasError}
          format={format}
          hours={hours}
          minutes={minutes}
        />
      </div>
    </div>
  );
});

function FormTimeRangeFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  required,
  tooltip,
  format = "12h",
  minuteStep = 15,
  labels,
}: FormTimeRangeFieldProps<TFieldValues, TName>) {
  const hours = useMemo(() => generateHours(format), [format]);
  const minutes = useMemo(() => generateMinutes(minuteStep), [minuteStep]);

  const mergedLabels = useMemo(
    () => ({
      from: "From",
      to: "To",
      ...labels,
    }),
    [labels]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
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
          <FormControl>
            <TimeRangeContent
              field={field as unknown as ControllerRenderProps<FieldValues, string>}
              disabled={disabled}
              hasError={!!fieldState.error}
              format={format}
              hours={hours}
              minutes={minutes}
              mergedLabels={mergedLabels}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormTimeRangeField = memo(
  FormTimeRangeFieldComponent
) as typeof FormTimeRangeFieldComponent;
