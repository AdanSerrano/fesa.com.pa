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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronDown, ChevronsUpDown, X, FolderTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps, TreeNode } from "./form-field.types";

export interface FormTreeSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: TreeNode[];
  multiple?: boolean;
  searchable?: boolean;
  showCheckboxes?: boolean;
  expandAll?: boolean;
  maxSelections?: number;
  emptyMessage?: string;
}

function getAllValues(nodes: TreeNode[]): string[] {
  const values: string[] = [];
  const traverse = (node: TreeNode) => {
    values.push(node.value);
    node.children?.forEach(traverse);
  };
  nodes.forEach(traverse);
  return values;
}

function findNodeByValue(nodes: TreeNode[], value: string): TreeNode | null {
  for (const node of nodes) {
    if (node.value === value) return node;
    if (node.children) {
      const found = findNodeByValue(node.children, value);
      if (found) return found;
    }
  }
  return null;
}

function getNodePath(nodes: TreeNode[], value: string, path: string[] = []): string[] | null {
  for (const node of nodes) {
    if (node.value === value) return [...path, node.label];
    if (node.children) {
      const found = getNodePath(node.children, value, [...path, node.label]);
      if (found) return found;
    }
  }
  return null;
}

const TreeItem = memo(function TreeItem({
  node,
  level,
  expanded,
  selected,
  multiple,
  showCheckboxes,
  expandedSet,
  selectedSet,
  onToggleExpand,
  onSelect,
  disabled,
}: {
  node: TreeNode;
  level: number;
  expanded: boolean;
  selected: boolean;
  multiple: boolean;
  showCheckboxes: boolean;
  expandedSet: Set<string>;
  selectedSet: Set<string>;
  onToggleExpand: (value: string) => void;
  onSelect: (value: string) => void;
  disabled?: boolean;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const Icon = node.icon;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer hover:bg-accent/50",
          selected && !multiple && "bg-accent",
          selected && multiple && "bg-accent/50",
          node.disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.disabled || disabled) return;
          onSelect(node.value);
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="p-0.5 hover:bg-accent rounded"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.value);
            }}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {showCheckboxes && multiple && (
          <Checkbox
            checked={selected}
            disabled={node.disabled || disabled}
            className="mr-1"
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={() => onSelect(node.value)}
          />
        )}

        {Icon && <Icon className="h-4 w-4 text-foreground/60 mr-1" />}

        <span className="text-sm flex-1 truncate">{node.label}</span>
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItem
              key={child.value}
              node={child}
              level={level + 1}
              expanded={expandedSet.has(child.value)}
              selected={selectedSet.has(child.value)}
              multiple={multiple}
              showCheckboxes={showCheckboxes}
              expandedSet={expandedSet}
              selectedSet={selectedSet}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
});

interface SelectedBadgeProps {
  value: string;
  label: string;
  onRemove: (value: string, e: React.MouseEvent) => void;
}

const SelectedBadge = memo(function SelectedBadge({
  value,
  label,
  onRemove,
}: SelectedBadgeProps) {
  return (
    <Badge variant="secondary" className="text-xs">
      {label}
      <span
        role="button"
        tabIndex={0}
        className="ml-1 hover:text-destructive cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(value, e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRemove(value, e as unknown as React.MouseEvent);
          }
        }}
      >
        <X className="h-3 w-3" />
      </span>
    </Badge>
  );
});

interface TreeSelectContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  hasError: boolean;
  disabled?: boolean;
  options: TreeNode[];
  multiple: boolean;
  showCheckboxes: boolean;
  expandAll: boolean;
  maxSelections?: number;
  placeholder: string;
  emptyMessage: string;
}

const TreeSelectContent = memo(function TreeSelectContent({
  field,
  hasError,
  disabled,
  options,
  multiple,
  showCheckboxes,
  expandAll,
  maxSelections,
  placeholder,
  emptyMessage,
}: TreeSelectContentProps) {
  const allValues = useMemo(() => getAllValues(options), [options]);
  const initialExpanded = useMemo(
    () => (expandAll ? new Set(allValues) : new Set<string>()),
    [expandAll, allValues]
  );

  const [expandedSet, setExpandedSet] = useState<Set<string>>(initialExpanded);

  const selectedValues: string[] = useMemo(() => {
    if (multiple) {
      return Array.isArray(field.value) ? field.value : [];
    }
    return field.value ? [field.value] : [];
  }, [field.value, multiple]);

  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const handleToggleExpand = useCallback((value: string) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      if (multiple) {
        const newSelected = selectedSet.has(value)
          ? selectedValues.filter((v) => v !== value)
          : maxSelections && selectedValues.length >= maxSelections
            ? selectedValues
            : [...selectedValues, value];
        field.onChange(newSelected);
      } else {
        field.onChange(value);
      }
    },
    [field, multiple, selectedSet, selectedValues, maxSelections]
  );

  const handleRemove = useCallback(
    (value: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (multiple) {
        field.onChange(selectedValues.filter((v) => v !== value));
      } else {
        field.onChange("");
      }
    },
    [field, multiple, selectedValues]
  );

  const renderSelectedLabels = useMemo(() => {
    if (selectedValues.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (multiple) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedValues.slice(0, 3).map((value) => {
            const node = findNodeByValue(options, value);
            return (
              <SelectedBadge
                key={value}
                value={value}
                label={node?.label || value}
                onRemove={handleRemove}
              />
            );
          })}
          {selectedValues.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{selectedValues.length - 3} more
            </Badge>
          )}
        </div>
      );
    }

    const path = getNodePath(options, selectedValues[0]);
    return <span className="truncate">{path?.join(" / ") || selectedValues[0]}</span>;
  }, [selectedValues, multiple, options, placeholder, handleRemove]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            hasError && "border-destructive"
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FolderTree className="h-4 w-4 text-foreground/60 shrink-0" />
            {renderSelectedLabels}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {options.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {emptyMessage}
              </p>
            ) : (
              options.map((node) => (
                <TreeItem
                  key={node.value}
                  node={node}
                  level={0}
                  expanded={expandedSet.has(node.value)}
                  selected={selectedSet.has(node.value)}
                  multiple={multiple}
                  showCheckboxes={showCheckboxes}
                  expandedSet={expandedSet}
                  selectedSet={selectedSet}
                  onToggleExpand={handleToggleExpand}
                  onSelect={handleSelect}
                  disabled={disabled}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
});

function FormTreeSelectFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Select...",
  disabled,
  className,
  required,
  options,
  multiple = false,
  showCheckboxes = true,
  expandAll = false,
  maxSelections,
  emptyMessage = "No options available",
}: FormTreeSelectFieldProps<TFieldValues, TName>) {
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
            <TreeSelectContent
              field={field as unknown as ControllerRenderProps<FieldValues, string>}
              hasError={!!fieldState.error}
              disabled={disabled}
              options={options}
              multiple={multiple}
              showCheckboxes={showCheckboxes}
              expandAll={expandAll}
              maxSelections={maxSelections}
              placeholder={placeholder}
              emptyMessage={emptyMessage}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormTreeSelectField = memo(
  FormTreeSelectFieldComponent
) as typeof FormTreeSelectFieldComponent;
