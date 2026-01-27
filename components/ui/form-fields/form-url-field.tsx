"use client";

import { memo, useMemo, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, ExternalLink, Check, X, Copy, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface FormUrlFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  showValidation?: boolean;
  showOpenLink?: boolean;
  showCopy?: boolean;
  showFavicon?: boolean;
  allowedProtocols?: string[];
  autoAddProtocol?: boolean;
}

interface UrlValidation {
  valid: boolean;
  protocol?: string;
  hostname?: string;
  error?: string;
}

function validateUrl(url: string, allowedProtocols: string[]): UrlValidation {
  if (!url || !url.trim()) {
    return { valid: false };
  }

  try {
    let urlToValidate = url;
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
      urlToValidate = `https://${url}`;
    }

    const parsed = new URL(urlToValidate);
    const protocol = parsed.protocol.replace(":", "");

    if (!allowedProtocols.includes(protocol)) {
      return {
        valid: false,
        protocol,
        error: `Protocol "${protocol}" not allowed`,
      };
    }

    return {
      valid: true,
      protocol,
      hostname: parsed.hostname,
    };
  } catch {
    return {
      valid: false,
      error: "Invalid URL format",
    };
  }
}

function getFaviconUrl(url: string): string | null {
  try {
    let urlToValidate = url;
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
      urlToValidate = `https://${url}`;
    }
    const parsed = new URL(urlToValidate);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`;
  } catch {
    return null;
  }
}

const UrlPreview = memo(function UrlPreview({
  validation,
  faviconUrl,
  showFavicon,
}: {
  validation: UrlValidation;
  faviconUrl: string | null;
  showFavicon: boolean;
}) {
  if (!validation.valid || !validation.hostname) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {showFavicon && faviconUrl && (
        <img
          src={faviconUrl}
          alt=""
          className="h-4 w-4"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <Globe className="h-3 w-3" />
      <span className="truncate">{validation.hostname}</span>
    </div>
  );
});

function FormUrlFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "https://example.com",
  disabled,
  className,
  required,
  showValidation = true,
  showOpenLink = true,
  showCopy = true,
  showFavicon = true,
  allowedProtocols = ["http", "https"],
  autoAddProtocol = true,
}: FormUrlFieldProps<TFieldValues, TName>) {
  const handleCopy = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
  }, []);

  const handleOpen = useCallback((url: string) => {
    let urlToOpen = url;
    if (autoAddProtocol && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
      urlToOpen = `https://${url}`;
    }
    window.open(urlToOpen, "_blank", "noopener,noreferrer");
  }, [autoAddProtocol]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const validation = useMemo(
          () => validateUrl(field.value || "", allowedProtocols),
          [field.value]
        );

        const faviconUrl = useMemo(
          () => (showFavicon && validation.valid ? getFaviconUrl(field.value || "") : null),
          [field.value, validation.valid]
        );

        const handleBlur = () => {
          field.onBlur();
          if (autoAddProtocol && field.value && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(field.value)) {
            field.onChange(`https://${field.value}`);
          }
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
              <div className="space-y-2">
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onBlur={handleBlur}
                      placeholder={placeholder}
                      disabled={disabled}
                      className={cn(
                        "bg-background pl-10",
                        fieldState.error && "border-destructive"
                      )}
                      type="url"
                    />
                  </div>
                  {(showOpenLink || showCopy) && field.value && validation.valid && (
                    <div className="flex gap-1">
                      {showCopy && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(field.value)}
                          disabled={disabled}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      {showOpenLink && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpen(field.value)}
                          disabled={disabled}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {field.value && (
                  <div className="flex flex-wrap items-center gap-2">
                    {showValidation && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          validation.valid
                            ? "text-green-600 border-green-600/30"
                            : "text-destructive border-destructive/30"
                        )}
                      >
                        {validation.valid ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Valid URL
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            {validation.error || "Invalid"}
                          </>
                        )}
                      </Badge>
                    )}
                    <UrlPreview
                      validation={validation}
                      faviconUrl={faviconUrl}
                      showFavicon={showFavicon}
                    />
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

export const FormUrlField = memo(
  FormUrlFieldComponent
) as typeof FormUrlFieldComponent;
