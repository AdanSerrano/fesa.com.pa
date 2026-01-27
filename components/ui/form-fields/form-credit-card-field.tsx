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
import { CreditCard, Calendar, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface CreditCardValue {
  number?: string;
  expiry?: string;
  cvc?: string;
  name?: string;
}

type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export interface FormCreditCardFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  showCardholderName?: boolean;
  showCardType?: boolean;
  labels?: {
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
    name?: string;
  };
  placeholders?: {
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
    name?: string;
  };
}

const DEFAULT_LABELS = {
  cardNumber: "Card Number",
  expiry: "Expiry",
  cvc: "CVC",
  name: "Cardholder Name",
};

const DEFAULT_PLACEHOLDERS = {
  cardNumber: "1234 5678 9012 3456",
  expiry: "MM/YY",
  cvc: "123",
  name: "John Doe",
};

const CARD_PATTERNS: { type: CardType; pattern: RegExp; icon: string }[] = [
  { type: "visa", pattern: /^4/, icon: "💳" },
  { type: "mastercard", pattern: /^5[1-5]/, icon: "💳" },
  { type: "amex", pattern: /^3[47]/, icon: "💳" },
  { type: "discover", pattern: /^6(?:011|5)/, icon: "💳" },
];

function detectCardType(number: string): CardType {
  const cleaned = number.replace(/\s/g, "");
  for (const { type, pattern } of CARD_PATTERNS) {
    if (pattern.test(cleaned)) {
      return type;
    }
  }
  return "unknown";
}

function formatCardNumber(value: string, cardType: CardType): string {
  const cleaned = value.replace(/\D/g, "");
  const maxLength = cardType === "amex" ? 15 : 16;
  const truncated = cleaned.slice(0, maxLength);

  if (cardType === "amex") {
    return truncated.replace(/(\d{4})(\d{6})?(\d{5})?/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(" ")
    );
  }

  return truncated.replace(/(\d{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const truncated = cleaned.slice(0, 4);

  if (truncated.length >= 2) {
    return `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
  }
  return truncated;
}

function formatCVC(value: string, cardType: CardType): string {
  const cleaned = value.replace(/\D/g, "");
  const maxLength = cardType === "amex" ? 4 : 3;
  return cleaned.slice(0, maxLength);
}

const CardTypeIcon = memo(function CardTypeIcon({ type }: { type: CardType }) {
  const colors: Record<CardType, string> = {
    visa: "text-blue-600",
    mastercard: "text-orange-600",
    amex: "text-blue-700",
    discover: "text-orange-500",
    unknown: "text-muted-foreground",
  };

  const labels: Record<CardType, string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX",
    discover: "DISC",
    unknown: "",
  };

  if (type === "unknown") {
    return <CreditCard className="h-5 w-5 text-muted-foreground" />;
  }

  return (
    <span className={cn("text-xs font-bold", colors[type])}>
      {labels[type]}
    </span>
  );
});

function FormCreditCardFieldComponent<
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
  showCardholderName = true,
  showCardType = true,
  labels: customLabels,
  placeholders: customPlaceholders,
}: FormCreditCardFieldProps<TFieldValues, TName>) {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...customLabels }), [customLabels]);
  const placeholders = useMemo(
    () => ({ ...DEFAULT_PLACEHOLDERS, ...customPlaceholders }),
    [customPlaceholders]
  );

  const updateField = useCallback(
    (
      currentValue: CreditCardValue,
      key: keyof CreditCardValue,
      newValue: string,
      onChange: (value: CreditCardValue) => void
    ) => {
      onChange({ ...currentValue, [key]: newValue });
    },
    []
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = (field.value || {}) as CreditCardValue;
        const cardType = detectCardType(value.number || "");
        const hasError = !!fieldState.error;

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const formatted = formatCardNumber(e.target.value, cardType);
          updateField(value, "number", formatted, field.onChange);
        };

        const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const formatted = formatExpiry(e.target.value);
          updateField(value, "expiry", formatted, field.onChange);
        };

        const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const formatted = formatCVC(e.target.value, cardType);
          updateField(value, "cvc", formatted, field.onChange);
        };

        const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          updateField(value, "name", e.target.value.toUpperCase(), field.onChange);
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
                  "rounded-lg border p-4 space-y-4",
                  hasError && "border-destructive"
                )}
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    {labels.cardNumber}
                  </label>
                  <div className="relative">
                    <Input
                      value={value.number || ""}
                      onChange={handleNumberChange}
                      placeholder={placeholders.cardNumber}
                      disabled={disabled}
                      className={cn("bg-background pr-16", hasError && "border-destructive")}
                      autoComplete="cc-number"
                    />
                    {showCardType && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CardTypeIcon type={cardType} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {labels.expiry}
                    </label>
                    <Input
                      value={value.expiry || ""}
                      onChange={handleExpiryChange}
                      placeholder={placeholders.expiry}
                      disabled={disabled}
                      className={cn("bg-background", hasError && "border-destructive")}
                      autoComplete="cc-exp"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      {labels.cvc}
                    </label>
                    <Input
                      type="password"
                      value={value.cvc || ""}
                      onChange={handleCVCChange}
                      placeholder={placeholders.cvc}
                      disabled={disabled}
                      className={cn("bg-background", hasError && "border-destructive")}
                      autoComplete="cc-csc"
                    />
                  </div>
                </div>

                {showCardholderName && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      {labels.name}
                    </label>
                    <Input
                      value={value.name || ""}
                      onChange={handleNameChange}
                      placeholder={placeholders.name}
                      disabled={disabled}
                      className={cn("bg-background uppercase", hasError && "border-destructive")}
                      autoComplete="cc-name"
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

export const FormCreditCardField = memo(
  FormCreditCardFieldComponent
) as typeof FormCreditCardFieldComponent;
