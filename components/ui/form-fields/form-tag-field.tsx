"use client";

import { memo, useCallback, useRef, useMemo } from "react";
import type { FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { BaseFormFieldProps, TagOption } from "./form-field.types";
import { FormFieldTooltip } from "./form-field-tooltip";

export interface FormTagFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  suggestions?: TagOption[];
  maxTags?: number;
  allowCustom?: boolean;
  validateTag?: (tag: string) => boolean;
  transformTag?: (tag: string) => string;
  labels?: {
    add?: string;
    placeholder?: string;
    noSuggestions?: string;
    maxReached?: string;
  };
  tagClassName?: string;
}

const DEFAULT_LABELS = {
  add: "Add tag",
  placeholder: "Type to add...",
  noSuggestions: "No suggestions found",
  maxReached: "Maximum tags reached",
};

interface TagBadgeProps {
  tag: string;
  label: string;
  color?: string;
  disabled?: boolean;
  tagClassName?: string;
  onRemove: (tag: string) => void;
}

const TagBadge = memo(function TagBadge({
  tag,
  label,
  color,
  disabled,
  tagClassName,
  onRemove,
}: TagBadgeProps) {
  const handleRemove = useCallback(() => {
    onRemove(tag);
  }, [tag, onRemove]);

  return (
    <Badge
      variant="secondary"
      className={cn("gap-1 pr-1", tagClassName)}
      style={color ? { backgroundColor: color, color: "#fff" } : undefined}
    >
      {label}
      <button
        type="button"
        onClick={handleRemove}
        disabled={disabled}
        className="ml-1 rounded-full hover:bg-black/20 p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
});

interface SuggestionItemProps {
  suggestion: TagOption;
  onSelect: (value: string) => void;
}

const SuggestionItem = memo(function SuggestionItem({
  suggestion,
  onSelect,
}: SuggestionItemProps) {
  const handleSelect = useCallback(() => {
    onSelect(suggestion.value);
  }, [suggestion.value, onSelect]);

  return (
    <CommandItem
      value={suggestion.value}
      onSelect={handleSelect}
    >
      {suggestion.color && (
        <div
          className="h-3 w-3 rounded-full mr-2"
          style={{ backgroundColor: suggestion.color }}
        />
      )}
      {suggestion.label}
    </CommandItem>
  );
});

interface TagContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  hasError: boolean;
  placeholder?: string;
  disabled?: boolean;
  suggestions: TagOption[];
  maxTags?: number;
  allowCustom: boolean;
  validateTag?: (tag: string) => boolean;
  transformTag?: (tag: string) => string;
  labels: typeof DEFAULT_LABELS;
  tagClassName?: string;
}

const TagContent = memo(function TagContent({
  field,
  hasError,
  placeholder,
  disabled,
  suggestions,
  maxTags,
  allowCustom,
  validateTag,
  transformTag,
  labels,
  tagClassName,
}: TagContentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);

  const tags: string[] = useMemo(
    () => field.value ?? [],
    [field.value]
  );

  const isMaxReached = maxTags !== undefined && tags.length >= maxTags;

  const filteredSuggestions = useMemo(() => {
    const input = inputRef.current?.value?.toLowerCase() ?? "";
    return suggestions.filter(
      (s) =>
        !tags.includes(s.value) &&
        (input === "" || s.label.toLowerCase().includes(input))
    );
  }, [suggestions, tags]);

  const addTag = useCallback(
    (value: string) => {
      if (isMaxReached) return;

      let processedValue = value.trim();
      if (!processedValue) return;

      if (transformTag) {
        processedValue = transformTag(processedValue);
      }

      if (validateTag && !validateTag(processedValue)) return;
      if (tags.includes(processedValue)) return;

      field.onChange([...tags, processedValue]);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [tags, field, isMaxReached, transformTag, validateTag]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      field.onChange(tags.filter((t) => t !== tagToRemove));
    },
    [tags, field]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = inputRef.current?.value;
        if (value && allowCustom) {
          addTag(value);
          openRef.current = false;
        }
      } else if (e.key === "Backspace" && !inputRef.current?.value && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
      }
    },
    [addTag, removeTag, tags, allowCustom]
  );

  const handleFocus = useCallback(() => {
    openRef.current = true;
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    openRef.current = open;
  }, []);

  const handleSelectSuggestion = useCallback(
    (value: string) => {
      addTag(value);
      openRef.current = false;
    },
    [addTag]
  );

  const handleOpenAutoFocus = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  const getTagLabel = useCallback(
    (tag: string) => {
      return suggestions.find((s) => s.value === tag)?.label ?? tag;
    },
    [suggestions]
  );

  const getTagColor = useCallback(
    (tag: string) => {
      return suggestions.find((s) => s.value === tag)?.color;
    },
    [suggestions]
  );

  const containerClasses = useMemo(
    () =>
      cn(
        "flex flex-wrap gap-2 p-2 rounded-md border bg-background min-h-[42px]",
        hasError && "border-destructive",
        disabled && "opacity-50 cursor-not-allowed"
      ),
    [hasError, disabled]
  );

  return (
    <div className={containerClasses}>
      {tags.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
          label={getTagLabel(tag)}
          color={getTagColor(tag)}
          disabled={disabled}
          tagClassName={tagClassName}
          onRemove={removeTag}
        />
      ))}

      {!isMaxReached && (
        <Popover open={openRef.current} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <div className="flex-1 min-w-[120px]">
              <Input
                ref={inputRef}
                placeholder={isMaxReached ? labels.maxReached : (placeholder ?? labels.placeholder)}
                disabled={disabled || isMaxReached}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                className="border-0 shadow-none p-0 h-7 focus-visible:ring-0"
              />
            </div>
          </PopoverTrigger>
          {(filteredSuggestions.length > 0 || allowCustom) && (
            <PopoverContent
              className="w-[200px] p-0"
              align="start"
              onOpenAutoFocus={handleOpenAutoFocus}
            >
              <Command>
                <CommandList>
                  <CommandEmpty>
                    {allowCustom
                      ? labels.add
                      : labels.noSuggestions}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredSuggestions.map((suggestion) => (
                      <SuggestionItem
                        key={suggestion.value}
                        suggestion={suggestion}
                        onSelect={handleSelectSuggestion}
                      />
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      )}
    </div>
  );
});

function FormTagFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  className,
  required,
  tooltip,
  suggestions = [],
  maxTags,
  allowCustom = true,
  validateTag,
  transformTag,
  labels,
  tagClassName,
}: FormTagFieldProps<TFieldValues, TName>) {
  const mergedLabels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...labels }),
    [labels]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
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
            <TagContent
              field={field as unknown as ControllerRenderProps<FieldValues, string>}
              hasError={!!fieldState.error}
              placeholder={placeholder}
              disabled={disabled}
              suggestions={suggestions}
              maxTags={maxTags}
              allowCustom={allowCustom}
              validateTag={validateTag}
              transformTag={transformTag}
              labels={mergedLabels}
              tagClassName={tagClassName}
            />
          </FormControl>
          <div className="flex items-center justify-between">
            {description && (
              <FormDescription className="text-xs flex-1">
                {description}
              </FormDescription>
            )}
            {maxTags && (
              <span className="text-xs text-muted-foreground">
                {(field.value?.length ?? 0)}/{maxTags}
              </span>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormTagField = memo(
  FormTagFieldComponent
) as typeof FormTagFieldComponent;
