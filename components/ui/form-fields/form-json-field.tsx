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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Braces, Copy, Check, WandSparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface FormJsonFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  minHeight?: number;
  maxHeight?: number;
  showToolbar?: boolean;
  showValidation?: boolean;
  allowFormat?: boolean;
  allowMinify?: boolean;
}

interface JsonValidation {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
}

function validateJson(value: string): JsonValidation {
  if (!value || !value.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(value);
    return { isValid: true };
  } catch (e) {
    const error = e as SyntaxError;
    const match = error.message.match(/position (\d+)/);
    let lineNumber: number | undefined;

    if (match) {
      const position = parseInt(match[1], 10);
      const lines = value.substring(0, position).split("\n");
      lineNumber = lines.length;
    }

    return {
      isValid: false,
      error: error.message,
      lineNumber,
    };
  }
}

function formatJson(value: string): string {
  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
  }
}

function minifyJson(value: string): string {
  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed);
  } catch {
    return value;
  }
}

const JsonToolbar = memo(function JsonToolbar({
  validation,
  onFormat,
  onMinify,
  onCopy,
  showFormat,
  showMinify,
}: {
  validation: JsonValidation;
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  showFormat: boolean;
  showMinify: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-2">
        <Braces className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium">JSON</span>
        {validation.isValid ? (
          <Badge variant="outline" className="text-green-600 border-green-600/30 text-xs">
            <Check className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        ) : (
          <Badge variant="outline" className="text-destructive border-destructive/30 text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Invalid
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1">
        {showFormat && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onFormat}
            disabled={!validation.isValid}
            className="h-7 text-xs"
          >
            <WandSparkles className="h-3 w-3 mr-1" />
            Format
          </Button>
        )}
        {showMinify && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMinify}
            disabled={!validation.isValid}
            className="h-7 text-xs"
          >
            Minify
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="h-7 w-7"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
});

const LineNumbers = memo(function LineNumbers({ count }: { count: number }) {
  const lines = useMemo(
    () => Array.from({ length: Math.max(1, count) }, (_, i) => i + 1),
    [count]
  );

  return (
    <div className="select-none text-right pr-3 pt-3 text-muted-foreground/50 font-mono text-sm leading-6 border-r">
      {lines.map((num) => (
        <div key={num}>{num}</div>
      ))}
    </div>
  );
});

function FormJsonFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = '{\n  "key": "value"\n}',
  disabled,
  className,
  required,
  minHeight = 200,
  maxHeight = 500,
  showToolbar = true,
  showValidation = true,
  allowFormat = true,
  allowMinify = true,
}: FormJsonFieldProps<TFieldValues, TName>) {
  const handleCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const validation = useMemo(
          () => validateJson(field.value || ""),
          [field.value]
        );
        const lineCount = (field.value || "").split("\n").length;

        const handleFormat = () => {
          field.onChange(formatJson(field.value || ""));
        };

        const handleMinify = () => {
          field.onChange(minifyJson(field.value || ""));
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
                  "rounded-md border bg-background overflow-hidden",
                  fieldState.error && "border-destructive",
                  !validation.isValid && showValidation && "border-amber-500",
                  disabled && "opacity-50"
                )}
              >
                {showToolbar && (
                  <JsonToolbar
                    validation={validation}
                    onFormat={handleFormat}
                    onMinify={handleMinify}
                    onCopy={() => handleCopy(field.value || "")}
                    showFormat={allowFormat}
                    showMinify={allowMinify}
                  />
                )}
                <div
                  className="flex overflow-auto"
                  style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
                >
                  <LineNumbers count={lineCount} />
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                      "flex-1 border-0 bg-transparent font-mono text-sm",
                      "focus-visible:ring-0 resize-none leading-6 rounded-none"
                    )}
                    style={{ minHeight: `${minHeight}px` }}
                    spellCheck={false}
                  />
                </div>
                {!validation.isValid && validation.error && showValidation && (
                  <div className="border-t bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 inline mr-1" />
                    {validation.lineNumber && `Line ${validation.lineNumber}: `}
                    {validation.error}
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

export const FormJsonField = memo(
  FormJsonFieldComponent
) as typeof FormJsonFieldComponent;
