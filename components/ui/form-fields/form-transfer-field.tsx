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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Search,
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

interface TransferListProps {
  title: string;
  items: FormFieldOption<string>[];
  selected: Set<string>;
  searchValue: string;
  searchPlaceholder: string;
  showSearch: boolean;
  showSelectAll: boolean;
  height: number;
  onSearchChange: (value: string) => void;
  onToggleItem: (value: string) => void;
  onSelectAll: () => void;
  disabled?: boolean;
}

const TransferList = memo(function TransferList({
  title,
  items,
  selected,
  searchValue,
  searchPlaceholder,
  showSearch,
  showSelectAll,
  height,
  onSearchChange,
  onToggleItem,
  onSelectAll,
  disabled,
}: TransferListProps) {
  const filteredItems = useMemo(
    () =>
      searchValue
        ? items.filter((item) =>
            item.label.toLowerCase().includes(searchValue.toLowerCase())
          )
        : items,
    [items, searchValue]
  );

  const allSelected = filteredItems.length > 0 && filteredItems.every((item) => selected.has(item.value));
  const someSelected = filteredItems.some((item) => selected.has(item.value));

  return (
    <div className="flex-1 min-w-0 border rounded-lg overflow-hidden">
      <div className="border-b bg-muted/30 px-3 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">
          {selected.size}/{items.length}
        </span>
      </div>

      {showSearch && (
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              disabled={disabled}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
      )}

      {showSelectAll && filteredItems.length > 0 && (
        <div
          className={cn(
            "px-3 py-2 border-b flex items-center gap-2 cursor-pointer hover:bg-accent/50",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && onSelectAll()}
        >
          <Checkbox
            checked={allSelected}
            className="pointer-events-none"
            {...(someSelected && !allSelected ? { "data-state": "indeterminate" } : {})}
          />
          <span className="text-sm">Select all</span>
        </div>
      )}

      <ScrollArea style={{ height }}>
        <div className="p-1">
          {filteredItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No items
            </p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.value}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-accent/50",
                  selected.has(item.value) && "bg-accent/30",
                  (item.disabled || disabled) && "cursor-not-allowed opacity-50"
                )}
                onClick={() => !item.disabled && !disabled && onToggleItem(item.value)}
              >
                <Checkbox
                  checked={selected.has(item.value)}
                  disabled={item.disabled || disabled}
                  className="pointer-events-none"
                />
                <span className="text-sm truncate">{item.label}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

const TransferButtons = memo(function TransferButtons({
  onMoveRight,
  onMoveLeft,
  onMoveAllRight,
  onMoveAllLeft,
  canMoveRight,
  canMoveLeft,
  canMoveAllRight,
  canMoveAllLeft,
  labels,
  disabled,
}: {
  onMoveRight: () => void;
  onMoveLeft: () => void;
  onMoveAllRight: () => void;
  onMoveAllLeft: () => void;
  canMoveRight: boolean;
  canMoveLeft: boolean;
  canMoveAllRight: boolean;
  canMoveAllLeft: boolean;
  labels: typeof DEFAULT_LABELS;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 justify-center px-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onMoveAllRight}
        disabled={disabled || !canMoveAllRight}
        className="h-8 w-8"
        title={labels.moveAllRight}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onMoveRight}
        disabled={disabled || !canMoveRight}
        className="h-8 w-8"
        title={labels.moveRight}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onMoveLeft}
        disabled={disabled || !canMoveLeft}
        className="h-8 w-8"
        title={labels.moveLeft}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onMoveAllLeft}
        disabled={disabled || !canMoveAllLeft}
        className="h-8 w-8"
        title={labels.moveAllLeft}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
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
      render={({ field, fieldState }) => {
        const selectedValues = new Set<string>(
          Array.isArray(field.value) ? field.value : []
        );

        const availableItems = useMemo(
          () => options.filter((opt) => !selectedValues.has(opt.value)),
          [options, selectedValues]
        );

        const selectedItems = useMemo(
          () => options.filter((opt) => selectedValues.has(opt.value)),
          [options, selectedValues]
        );

        const leftSelected = { current: new Set<string>() };
        const rightSelected = { current: new Set<string>() };
        const leftSearch = { current: "" };
        const rightSearch = { current: "" };

        const handleMoveRight = () => {
          const newValues = new Set(selectedValues);
          leftSelected.current.forEach((v) => newValues.add(v));
          field.onChange(Array.from(newValues));
          leftSelected.current.clear();
        };

        const handleMoveLeft = () => {
          const newValues = new Set(selectedValues);
          rightSelected.current.forEach((v) => newValues.delete(v));
          field.onChange(Array.from(newValues));
          rightSelected.current.clear();
        };

        const handleMoveAllRight = () => {
          const newValues = new Set(selectedValues);
          availableItems
            .filter((item) => !item.disabled)
            .forEach((item) => newValues.add(item.value));
          field.onChange(Array.from(newValues));
        };

        const handleMoveAllLeft = () => {
          const newValues = new Set(selectedValues);
          selectedItems
            .filter((item) => !item.disabled)
            .forEach((item) => newValues.delete(item.value));
          field.onChange(Array.from(newValues));
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
              <div
                className={cn(
                  "flex items-stretch gap-2",
                  fieldState.error && "[&>div]:border-destructive"
                )}
              >
                <TransferList
                  title={labels.available}
                  items={availableItems}
                  selected={leftSelected.current}
                  searchValue={leftSearch.current}
                  searchPlaceholder={labels.searchAvailable}
                  showSearch={showSearch}
                  showSelectAll={showSelectAll}
                  height={height}
                  onSearchChange={(v) => {
                    leftSearch.current = v;
                  }}
                  onToggleItem={(v) => {
                    if (leftSelected.current.has(v)) {
                      leftSelected.current.delete(v);
                    } else {
                      leftSelected.current.add(v);
                    }
                  }}
                  onSelectAll={() => {
                    const filtered = availableItems.filter(
                      (i) =>
                        !i.disabled &&
                        i.label.toLowerCase().includes(leftSearch.current.toLowerCase())
                    );
                    const allSelected = filtered.every((i) => leftSelected.current.has(i.value));
                    if (allSelected) {
                      filtered.forEach((i) => leftSelected.current.delete(i.value));
                    } else {
                      filtered.forEach((i) => leftSelected.current.add(i.value));
                    }
                  }}
                  disabled={disabled}
                />

                <TransferButtons
                  onMoveRight={handleMoveRight}
                  onMoveLeft={handleMoveLeft}
                  onMoveAllRight={handleMoveAllRight}
                  onMoveAllLeft={handleMoveAllLeft}
                  canMoveRight={leftSelected.current.size > 0}
                  canMoveLeft={rightSelected.current.size > 0}
                  canMoveAllRight={availableItems.some((i) => !i.disabled)}
                  canMoveAllLeft={selectedItems.some((i) => !i.disabled)}
                  labels={labels}
                  disabled={disabled}
                />

                <TransferList
                  title={labels.selected}
                  items={selectedItems}
                  selected={rightSelected.current}
                  searchValue={rightSearch.current}
                  searchPlaceholder={labels.searchSelected}
                  showSearch={showSearch}
                  showSelectAll={showSelectAll}
                  height={height}
                  onSearchChange={(v) => {
                    rightSearch.current = v;
                  }}
                  onToggleItem={(v) => {
                    if (rightSelected.current.has(v)) {
                      rightSelected.current.delete(v);
                    } else {
                      rightSelected.current.add(v);
                    }
                  }}
                  onSelectAll={() => {
                    const filtered = selectedItems.filter(
                      (i) =>
                        !i.disabled &&
                        i.label.toLowerCase().includes(rightSearch.current.toLowerCase())
                    );
                    const allSelected = filtered.every((i) => rightSelected.current.has(i.value));
                    if (allSelected) {
                      filtered.forEach((i) => rightSelected.current.delete(i.value));
                    } else {
                      filtered.forEach((i) => rightSelected.current.add(i.value));
                    }
                  }}
                  disabled={disabled}
                />
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

export const FormTransferField = memo(
  FormTransferFieldComponent
) as typeof FormTransferFieldComponent;
