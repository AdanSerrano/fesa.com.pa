"use client";

import { memo, useCallback, useMemo, useState } from "react";
import type { FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Search,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps, FormFieldOption } from "./form-field.types";

export interface FormTransferFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: FormFieldOption<string>[];
  showSearch?: boolean;
  showSelectAll?: boolean;
  height?: number;
  labels?: {
    available?: string;
    selected?: string;
    searchAvailable?: string;
    searchSelected?: string;
    moveRight?: string;
    moveLeft?: string;
    moveAllRight?: string;
    moveAllLeft?: string;
  };
}

const DEFAULT_LABELS = {
  available: "Available",
  selected: "Selected",
  searchAvailable: "Search available...",
  searchSelected: "Search selected...",
  moveRight: "Move right",
  moveLeft: "Move left",
  moveAllRight: "Move all right",
  moveAllLeft: "Move all left",
};

interface SimpleCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
}

const SimpleCheckbox = memo(function SimpleCheckbox({ checked, indeterminate }: SimpleCheckboxProps) {
  return (
    <div
      className={cn(
        "size-4 shrink-0 rounded-[4px] border shadow-xs flex items-center justify-center",
        checked ? "bg-primary border-primary text-primary-foreground" : "border-input",
        indeterminate && !checked && "bg-primary/50 border-primary"
      )}
    >
      {checked && <Check className="size-3" />}
      {indeterminate && !checked && <div className="size-2 bg-primary-foreground rounded-sm" />}
    </div>
  );
});

interface TransferContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  hasError: boolean;
  disabled?: boolean;
  options: FormFieldOption<string>[];
  showSearch: boolean;
  showSelectAll: boolean;
  height: number;
  labels: typeof DEFAULT_LABELS;
}

const TransferContent = memo(function TransferContent({
  field,
  hasError,
  disabled,
  options,
  showSearch,
  showSelectAll,
  height,
  labels,
}: TransferContentProps) {
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");

  const fieldValue: string[] = Array.isArray(field.value) ? field.value : [];

  const availableItems = useMemo(
    () => options.filter((opt) => !fieldValue.includes(opt.value)),
    [options, fieldValue]
  );

  const selectedItems = useMemo(
    () => options.filter((opt) => fieldValue.includes(opt.value)),
    [options, fieldValue]
  );

  const filteredAvailable = useMemo(
    () =>
      leftSearch
        ? availableItems.filter((item) =>
            item.label.toLowerCase().includes(leftSearch.toLowerCase())
          )
        : availableItems,
    [availableItems, leftSearch]
  );

  const filteredSelected = useMemo(
    () =>
      rightSearch
        ? selectedItems.filter((item) =>
            item.label.toLowerCase().includes(rightSearch.toLowerCase())
          )
        : selectedItems,
    [selectedItems, rightSearch]
  );

  const handleLeftItemClick = useCallback((value: string) => {
    setLeftChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  const handleRightItemClick = useCallback((value: string) => {
    setRightChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  const handleMoveRight = useCallback(() => {
    const newValue = [...fieldValue, ...leftChecked];
    field.onChange(newValue);
    setLeftChecked([]);
  }, [field, fieldValue, leftChecked]);

  const handleMoveLeft = useCallback(() => {
    const newValue = fieldValue.filter((v) => !rightChecked.includes(v));
    field.onChange(newValue);
    setRightChecked([]);
  }, [field, fieldValue, rightChecked]);

  const handleMoveAllRight = useCallback(() => {
    const toMove = filteredAvailable.filter((i) => !i.disabled).map((i) => i.value);
    const newValue = [...fieldValue, ...toMove];
    field.onChange(newValue);
    setLeftChecked([]);
  }, [field, fieldValue, filteredAvailable]);

  const handleMoveAllLeft = useCallback(() => {
    const toRemove = filteredSelected.filter((i) => !i.disabled).map((i) => i.value);
    const newValue = fieldValue.filter((v) => !toRemove.includes(v));
    field.onChange(newValue);
    setRightChecked([]);
  }, [field, fieldValue, filteredSelected]);

  const handleSelectAllLeft = useCallback(() => {
    const enabledItems = filteredAvailable.filter((i) => !i.disabled).map((i) => i.value);
    const allChecked = enabledItems.every((v) => leftChecked.includes(v));
    if (allChecked) {
      setLeftChecked((prev) => prev.filter((v) => !enabledItems.includes(v)));
    } else {
      setLeftChecked((prev) => [...new Set([...prev, ...enabledItems])]);
    }
  }, [filteredAvailable, leftChecked]);

  const handleSelectAllRight = useCallback(() => {
    const enabledItems = filteredSelected.filter((i) => !i.disabled).map((i) => i.value);
    const allChecked = enabledItems.every((v) => rightChecked.includes(v));
    if (allChecked) {
      setRightChecked((prev) => prev.filter((v) => !enabledItems.includes(v)));
    } else {
      setRightChecked((prev) => [...new Set([...prev, ...enabledItems])]);
    }
  }, [filteredSelected, rightChecked]);

  const leftAllChecked = filteredAvailable.length > 0 &&
    filteredAvailable.filter((i) => !i.disabled).every((i) => leftChecked.includes(i.value));
  const leftSomeChecked = filteredAvailable.some((i) => leftChecked.includes(i.value));

  const rightAllChecked = filteredSelected.length > 0 &&
    filteredSelected.filter((i) => !i.disabled).every((i) => rightChecked.includes(i.value));
  const rightSomeChecked = filteredSelected.some((i) => rightChecked.includes(i.value));

  return (
    <div
      className={cn(
        "flex items-stretch gap-2",
        hasError && "[&>div]:border-destructive"
      )}
    >
      <div className="flex-1 min-w-0 border rounded-lg overflow-hidden">
        <div className="border-b bg-muted/30 px-3 py-2 flex items-center justify-between">
          <span className="text-sm font-medium">{labels.available}</span>
          <span className="text-xs text-muted-foreground">
            {leftChecked.length}/{availableItems.length}
          </span>
        </div>

        {showSearch && (
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60 z-10 pointer-events-none" />
              <Input
                value={leftSearch}
                onChange={(e) => setLeftSearch(e.target.value)}
                placeholder={labels.searchAvailable}
                disabled={disabled}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>
        )}

        {showSelectAll && filteredAvailable.length > 0 && (
          <div
            className={cn(
              "px-3 py-2 border-b flex items-center gap-2 cursor-pointer hover:bg-accent/50",
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={() => !disabled && handleSelectAllLeft()}
          >
            <SimpleCheckbox checked={leftAllChecked} indeterminate={leftSomeChecked && !leftAllChecked} />
            <span className="text-sm">Select all</span>
          </div>
        )}

        <div className="overflow-y-auto p-1" style={{ height }}>
          {filteredAvailable.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No items</p>
          ) : (
            filteredAvailable.map((item) => (
              <div
                key={item.value}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-accent/50",
                  leftChecked.includes(item.value) && "bg-accent/30",
                  (item.disabled || disabled) && "cursor-not-allowed opacity-50"
                )}
                onClick={() => !item.disabled && !disabled && handleLeftItemClick(item.value)}
              >
                <SimpleCheckbox checked={leftChecked.includes(item.value)} />
                <span className="text-sm truncate">{item.label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-center px-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMoveAllRight}
          disabled={disabled || filteredAvailable.filter((i) => !i.disabled).length === 0}
          className="h-8 w-8"
          title={labels.moveAllRight}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMoveRight}
          disabled={disabled || leftChecked.length === 0}
          className="h-8 w-8"
          title={labels.moveRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMoveLeft}
          disabled={disabled || rightChecked.length === 0}
          className="h-8 w-8"
          title={labels.moveLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMoveAllLeft}
          disabled={disabled || filteredSelected.filter((i) => !i.disabled).length === 0}
          className="h-8 w-8"
          title={labels.moveAllLeft}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 min-w-0 border rounded-lg overflow-hidden">
        <div className="border-b bg-muted/30 px-3 py-2 flex items-center justify-between">
          <span className="text-sm font-medium">{labels.selected}</span>
          <span className="text-xs text-muted-foreground">
            {rightChecked.length}/{selectedItems.length}
          </span>
        </div>

        {showSearch && (
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60 z-10 pointer-events-none" />
              <Input
                value={rightSearch}
                onChange={(e) => setRightSearch(e.target.value)}
                placeholder={labels.searchSelected}
                disabled={disabled}
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>
        )}

        {showSelectAll && filteredSelected.length > 0 && (
          <div
            className={cn(
              "px-3 py-2 border-b flex items-center gap-2 cursor-pointer hover:bg-accent/50",
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={() => !disabled && handleSelectAllRight()}
          >
            <SimpleCheckbox checked={rightAllChecked} indeterminate={rightSomeChecked && !rightAllChecked} />
            <span className="text-sm">Select all</span>
          </div>
        )}

        <div className="overflow-y-auto p-1" style={{ height }}>
          {filteredSelected.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No items</p>
          ) : (
            filteredSelected.map((item) => (
              <div
                key={item.value}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-accent/50",
                  rightChecked.includes(item.value) && "bg-accent/30",
                  (item.disabled || disabled) && "cursor-not-allowed opacity-50"
                )}
                onClick={() => !item.disabled && !disabled && handleRightItemClick(item.value)}
              >
                <SimpleCheckbox checked={rightChecked.includes(item.value)} />
                <span className="text-sm truncate">{item.label}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

function FormTransferFieldComponent<
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
  options,
  showSearch = true,
  showSelectAll = true,
  height = 250,
  labels: customLabels,
}: FormTransferFieldProps<TFieldValues, TName>) {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...customLabels }), [customLabels]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <TransferContent
              field={field as unknown as ControllerRenderProps<FieldValues, string>}
              hasError={!!fieldState.error}
              disabled={disabled}
              options={options}
              showSearch={showSearch}
              showSelectAll={showSelectAll}
              height={height}
              labels={labels}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormTransferField = memo(
  FormTransferFieldComponent
) as typeof FormTransferFieldComponent;
